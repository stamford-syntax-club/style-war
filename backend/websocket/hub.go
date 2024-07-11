package websocket

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/stamford-syntax-club/style-war/backend/app/challenge"
	"github.com/stamford-syntax-club/style-war/backend/app/code"
)

type Hub struct {
	clients    map[string]*Client
	register   chan *Client
	unregister chan *Client
	broadcast  chan *Msg
	timer      *time.Timer
	timerCh    chan challenge.Challenge
	admin      *websocket.Conn

	mutex sync.Mutex

	codeRepo      code.CodeRepo
	challengeRepo challenge.ChallengeRepo

	// NOTE: this map acts as a cache to avoid O(n) database operation
	// which can bring down our backend during the competition day
	// only updated when the program starts, and upon receiving "timer:sync" event
	challengeExpiration map[int]time.Time
}

func NewHub(codeRepo code.CodeRepo, challengeRepo challenge.ChallengeRepo, timerCh chan challenge.Challenge) *Hub {
	return &Hub{
		clients:             make(map[string]*Client),
		unregister:          make(chan *Client),
		register:            make(chan *Client),
		broadcast:           make(chan *Msg),
		timerCh:             timerCh,
		admin:               nil,
		codeRepo:            codeRepo,
		challengeRepo:       challengeRepo,
		challengeExpiration: make(map[int]time.Time),
	}
}

func (h *Hub) registerClient(client *Client) {
	h.mutex.Lock()
	defer h.mutex.Unlock()

	if _, ok := h.clients[client.Id]; ok {
		log.Println("connection refresh, id: ", client.Id)
	} else {
		log.Println("new client registered, id: ", client.Id)
	}

	h.clients[client.Id] = client
}

func (h *Hub) unregisterClient(client *Client) {
	h.mutex.Lock()
	defer h.mutex.Unlock()

	if _, ok := h.clients[client.Id]; ok {
		log.Println("client unregistered, id: ", client.Id)
		delete(h.clients, client.Id)
	}
}

func (h *Hub) startTimer(startTime time.Time, duration time.Duration) {
	// setup end time
	if h.timer == nil {
		h.timer = time.AfterFunc(duration, func() {
			log.Println("TIMES UP!!")
			h.timer = nil
		})
		go func() {
			ticker := time.NewTicker(time.Second)
			defer ticker.Stop()

			for range ticker.C {
				elapsed := time.Since(startTime)
				remaining := duration - elapsed

				// stop this func if exceeds endDuration
				if remaining <= 0 {
					break
				}

				log.Println("remaining time: ", remaining.Seconds())

				msg := Msg{Event: "timer:status", RemainingTime: time.Duration(remaining.Seconds())}
				// send update to admin
				if h.admin != nil {
					if err := h.admin.WriteJSON(msg); err != nil {
						log.Println("error writing updated expiration to admin: ", err)
					}
				}

				// send update to clients
				for userId, client := range h.clients {
					if err := client.WriteJSON(msg); err != nil {
						log.Printf("error writing updated expiration to %s due to: %v\n", userId, err)
					}
				}
			}
		}()
	}
}

func (h *Hub) syncChallengeExpiration(challenge *challenge.Challenge) {
	h.mutex.Lock()
	defer h.mutex.Unlock()

	if challenge == nil {
		var err error
		challenge, err = h.challengeRepo.GetActiveChallenge()
		if err != nil {
			log.Println("error retrieving active challenge: ", err)
			return
		}
	}

	h.challengeExpiration[challenge.ID] = challenge.StartTime.Add(challenge.Duration * time.Minute)
}

func (h *Hub) handleCodeSubmission(msg *Msg) {
	h.mutex.Lock()
	challengeExpiredTime := h.challengeExpiration[msg.Code.ChallengeId]
	h.mutex.Unlock()

	if time.Now().After(challengeExpiredTime) {
		log.Printf("submission for challenge: %d is expired", msg.Code.ChallengeId)
		err := h.clients[msg.Code.UserId].Conn.WriteMessage(websocket.TextMessage, []byte("Time is up!"))
		if err != nil {
			log.Println("error writing to client: ", err)
		}
		return
	}

	// TODO: update to db
	log.Printf("%+v\n", msg.Code)
	h.clients[msg.Code.UserId].Conn.WriteMessage(
		websocket.TextMessage,
		[]byte(fmt.Sprintf("Submission from %s for challenge %d received!",
			msg.Code.UserId,
			msg.Code.ChallengeId)))
	// h.codeRepo

	// Broadcast to admin
	if h.admin != nil {
		h.admin.WriteJSON(msg)
	}
}

func (h *Hub) handleMessage(msg *Msg) {
	if msg.Event == "code:edit" {
		h.handleCodeSubmission(msg)
	}
}

func (h *Hub) Run(ctx context.Context) {
	defer func() {
		close(h.register)
		close(h.unregister)
		close(h.broadcast)
	}()

	h.syncChallengeExpiration(nil)

	for {
		select {
		case client := <-h.register:
			h.registerClient(client)
		case client := <-h.unregister:
			h.unregisterClient(client)
		case msg := <-h.broadcast:
			h.handleMessage(msg)
		case challenge := <-h.timerCh:
			h.syncChallengeExpiration(&challenge)
			h.startTimer(challenge.StartTime, challenge.Duration*time.Minute)
		case <-ctx.Done():
			return
		}
	}
}
