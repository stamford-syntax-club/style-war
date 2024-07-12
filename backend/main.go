package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

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

	// Database
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Bangkok",
		os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"), os.Getenv("DB_PORT"))
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
		DryRun: false, // "true" for test sql statement (not effect to database)
	})
	if err != nil {
		log.Fatalln("failed to connect database: " + err.Error())
	}

	db.AutoMigrate(challenge.Challenge{})
	db.AutoMigrate(code.Code{})

	// Repositories
	challengeRepo := challenge.NewChallengeRepoImpl(db)
	codeRepo := code.NewCodeRepoImpl(db)

	// GraphQL Server
	timerCh := make(chan challenge.Challenge)
	codeGql := code.NewGraphQL(codeRepo)
	challengeGql := challenge.NewGraphQL(challengeRepo, timerCh)
	gqlHandler := graphql.CreateHandler(challengeGql, codeGql)
	app.GET("/graphql", jwtOptionalAuth.MiddlewareFunc(), gqlHandler)
	app.POST("/graphql", jwtOptionalAuth.MiddlewareFunc(), gqlHandler)

	// Websocket Server
	h := websocket.NewHub(codeRepo, challengeRepo, timerCh)
	go h.Run(ctx)
	app.GET("/ws/:room", jwtAuth.MiddlewareFunc(), func(c *gin.Context) {
		room := c.Param("room")
		websocket.Serve(c, h, room)
	})

	// TODO: graceful shutdown
	app.Run(":8080")
}
