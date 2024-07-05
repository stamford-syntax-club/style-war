package main

import (
	"context"
	"log"
	"os"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/stamford-syntax-club/style-war/backend/app/challenge"
	"github.com/stamford-syntax-club/style-war/backend/app/code"
	"github.com/stamford-syntax-club/style-war/backend/graphql"
	"github.com/stamford-syntax-club/style-war/backend/websocket"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := godotenv.Load(); err != nil {
		log.Fatalln("error loading environment variable: ", err)
	}

	jwtAuth := &jwt.GinJWTMiddleware{
		Realm:       "style-wars",
		Key:         []byte(os.Getenv("JWT_SECRET")),
		TokenLookup: "query:token",
		Unauthorized: func(c *gin.Context, code int, message string) {
			c.JSON(code, gin.H{
				"code":    code,
				"message": message,
			})
		},
		SigningAlgorithm: "HS256",
	}
	if err := jwtAuth.MiddlewareInit(); err != nil {
		log.Fatalf("JWT Middleware initialization failed: %v", err)
	}
	challengeRepo := challenge.NewChallengeRepo()
	challengeQuery := challenge.NewGqlQuery(challengeRepo)
	codeRepo := code.NewCodeRepo()
	codeQuery := code.NewGqlQuery(codeRepo)

	app := gin.Default()
	app.Use(cors.Default())

	h := websocket.NewHub(codeRepo)
	go h.Run(ctx)

	gqlHandler := graphql.CreateHandler(challengeQuery, codeQuery)
	app.GET("/graphql", gin.WrapH(gqlHandler))
	app.POST("/graphql", gin.WrapH(gqlHandler))

	app.GET("/ws/:room", jwtAuth.MiddlewareFunc(), func(c *gin.Context) {
		room := c.Param("room")
		websocket.Serve(c, h, room)
	})

	app.Run(":8080")
}
