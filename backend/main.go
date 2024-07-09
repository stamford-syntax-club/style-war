package main

import (
	"context"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/stamford-syntax-club/style-war/backend/app/challenge"
	"github.com/stamford-syntax-club/style-war/backend/app/code"
	"github.com/stamford-syntax-club/style-war/backend/common"
	"github.com/stamford-syntax-club/style-war/backend/graphql"
	"github.com/stamford-syntax-club/style-war/backend/websocket"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := godotenv.Load(); err != nil {
		log.Fatalln("error loading environment variable: ", err)
	}

	jwtOptionalAuth := common.NewOptionalJWTMiddleware()
	jwtAuth := common.NewJWTMiddleware()

	app := gin.Default()
	corsConf := cors.DefaultConfig()
	corsConf.AddAllowHeaders("Authorization")
	corsConf.AllowOriginFunc = func(origin string) bool {
		return true
	}
	app.Use(cors.New(corsConf))

	// Repositories
	challengeRepo := challenge.NewChallengeRepoImpl()
	codeRepo := code.NewCodeRepoImpl()

	// GraphQL Server
	codeQuery := code.NewGqlQuery(codeRepo)
	challengeQuery := challenge.NewGqlQuery(challengeRepo)
	app.GET("/graphql", jwtOptionalAuth.MiddlewareFunc(), graphql.CreateHandler(challengeQuery, codeQuery))
	app.POST("/graphql", jwtOptionalAuth.MiddlewareFunc(), graphql.CreateHandler(challengeQuery, codeQuery))

	// Websocket Server
	h := websocket.NewHub(codeRepo)
	go h.Run(ctx)
	app.GET("/ws/:room", jwtAuth.MiddlewareFunc(), func(c *gin.Context) {
		room := c.Param("room")
		websocket.Serve(c, h, room)
	})

	// TODO: graceful shutdown
	app.Run(":8080")
}
