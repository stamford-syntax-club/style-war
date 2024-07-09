package websocket

import (
	"context"
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
	admin      *websocket.Conn

	mutex sync.Mutex

	codeRepo      code.CodeRepo
	challengeRepo challenge.ChallengeRepo

	// NOTE: this map acts as a cache to avoid O(n) database operation
	// which can bring down our backend during the competition day
	// only updated when the program starts, and upon receiving "timer:sync" event
	challengeExpiration map[int]time.Time
}

func NewHub(codeRepo code.CodeRepo, challengeRepo challenge.ChallengeRepo) *Hub {
	return &Hub{
		clients:             make(map[string]*Client),
		unregister:          make(chan *Client),
		register:            make(chan *Client),
		broadcast:           make(chan *Msg),
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

func (h *Hub) syncChallengeExpiration() {
	challenges, err := h.challengeRepo.GetAllChallenges("id", "end")
	if err != nil {
		log.Println("error retrieving challenges in hub: ", err)
	}
	h.mutex.Lock()
	defer h.mutex.Unlock()
	for _, challenge := range challenges {
		h.challengeExpiration[challenge.ID] = challenge.End
	}
}

func (h *Hub) handleCodeSubmission(msg *Msg) {
	h.mutex.Lock()
	challengeExpiredTime := h.challengeExpiration[msg.Code.ChallengeId]
	h.mutex.Unlock()

	if time.Now().After(challengeExpiredTime) {
		err := h.clients[msg.Code.UserId].Conn.WriteMessage(websocket.TextMessage, []byte("Time is up!"))
		if err != nil {
			log.Println("error writing to client: ", err)
		}
		return
	}

	// TODO: update to db
	log.Printf("%+v\n", msg)
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

	if msg.Event == "timer:sync" {
		h.syncChallengeExpiration()
	}
}

func (h *Hub) Run(ctx context.Context) {
	defer func() {
		close(h.register)
		close(h.unregister)
		close(h.broadcast)
	}()

	// sync expiration from database when the program initially runs
	h.syncChallengeExpiration()

	for {
		select {
		case client := <-h.register:
			h.registerClient(client)
		case client := <-h.unregister:
			h.unregisterClient(client)
		case msg := <-h.broadcast:
			h.handleMessage(msg)
		case <-ctx.Done():
			return
		}
	}
}
