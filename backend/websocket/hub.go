package websocket

import (
	"context"
	"log"

	"github.com/gorilla/websocket"
	"github.com/stamford-syntax-club/style-war/backend/app/code"
)

type Hub struct {
	clients    map[string]*Client
	register   chan *Client
	unregister chan *Client
	broadcast  chan *Msg
	admin      *websocket.Conn

	codeRepo *code.CodeRepoImpl
}

func NewHub(codeRepo *code.CodeRepoImpl) *Hub {
	return &Hub{
		clients:    make(map[string]*Client),
		unregister: make(chan *Client),
		register:   make(chan *Client),
		broadcast:  make(chan *Msg),
		admin:      nil,
		codeRepo:   codeRepo,
	}
}

func (h *Hub) registerClient(client *Client) {
	// TODO: mutex lock

	if _, ok := h.clients[client.Id]; ok {
		log.Println("connection refresh, id: ", client.Id)
	} else {
		log.Println("new client registered, id: ", client.Id)
	}

	h.clients[client.Id] = client
}

func (h *Hub) unregisterClient(client *Client) {
	// TODO: mutex lock
	if _, ok := h.clients[client.Id]; ok {
		log.Println("client unregistered, id: ", client.Id)
		delete(h.clients, client.Id)
	}
}

func (h *Hub) handleMessage(msg *Msg) {
	if msg.Event == "code:edit" {
		// TODO: update to db
		log.Printf("%+v\n", msg)
		// h.codeRepo
	}

	// Broadcast to admin
	if h.admin != nil {
		h.admin.WriteJSON(msg)
	}
}

func (h *Hub) Run(ctx context.Context) {
	defer func() {
		close(h.register)
		close(h.unregister)
		close(h.broadcast)
	}()

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
