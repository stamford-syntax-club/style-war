package websocket

import (
	"log"

	"github.com/gorilla/websocket"
	"github.com/stamford-syntax-club/style-war/backend/app/code"
)

type Msg struct {
	Event     string `json:"event"`
	code.Code `json:"code"`
}

type Client struct {
	Id string
	*websocket.Conn
	hub *Hub
}

func NewClient(id string, conn *websocket.Conn, hub *Hub) *Client {
	return &Client{Id: id, Conn: conn, hub: hub}
}

func (c *Client) ReadMessages() {
	defer func() {
		c.Conn.Close()
		c.hub.unregister <- c
	}()

	// ws.SetReadDeadline(time.Now().Add(time.Second * 60))

	for {
		var msg = &Msg{Code: code.Code{UserId: c.Id}}
		if err := c.Conn.ReadJSON(msg); err != nil {
			log.Printf("Error reading message from %s: %v", c.Id, err)
			break
		}

		c.hub.broadcast <- msg
	}
}
