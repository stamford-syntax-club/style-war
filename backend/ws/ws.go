package ws

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/stamford-syntax-club/style-war/backend/common"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func Serve(c *gin.Context, h *Hub, room string) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("error upgrading ws connection: ", err.Error())
		return
	}

	userId := common.ExtractUserId(c)

	if room == "competition" {
		client := NewClient(userId, conn, h)

		h.register <- client

		go client.ReadMessages()
	}

	if room == "admin" {
		log.Println("admin has connected")
		h.admin = conn
	}
}
