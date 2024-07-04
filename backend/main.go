package main

import (
	"context"
	"log"
	"os"

	jwt "github.com/appleboy/gin-jwt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/stamford-syntax-club/style-war/backend/graphql"
	"github.com/stamford-syntax-club/style-war/backend/ws"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalln("error loading environment variable: ", err)
	}

	app := gin.New()

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

	app.Use(gin.Logger(), cors.Default())

	h := ws.NewHub()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	go h.Run(ctx)

	gqlHandler := graphql.CreateHandler()
	app.GET("/graphql", gin.WrapH(gqlHandler))
	app.POST("/graphql", gin.WrapH(gqlHandler))

	app.GET("/ws/:room", jwtAuth.MiddlewareFunc(), func(c *gin.Context) {
		room := c.Param("room")
		ws.Serve(c, h, room)
	})

	app.Run(":8080")
}
