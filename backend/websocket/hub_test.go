package websocket

import (
	"context"
	"sync"
	"testing"
	"time"

	"github.com/stamford-syntax-club/style-war/backend/app/challenge"
	challenge_mock "github.com/stamford-syntax-club/style-war/backend/app/challenge/mocks"
	code_mock "github.com/stamford-syntax-club/style-war/backend/app/code/mocks"
	"github.com/stretchr/testify/suite"
)

type HubTestSuite struct {
	ctx       context.Context
	ctxCancel context.CancelFunc
	hub       *Hub
	suite.Suite
	mutex sync.Mutex
}

func TestHubSuite(t *testing.T) {
	suite.Run(t, new(HubTestSuite))
}

// setup dependecies before running each test
func (suite *HubTestSuite) SetupSubTest() {
	challengeRepo := challenge_mock.NewChallengeRepo(suite.Suite.T())
	codeRepo := code_mock.NewCodeRepo(suite.Suite.T())
	challengeRepo.On("GetAllChallenges", "id", "end").Return([]challenge.Challenge{
		{
			ID:  1,
			End: time.Now().Add(time.Minute),
		},
	}, nil)
	suite.hub = NewHub(codeRepo, challengeRepo)
	suite.ctx, suite.ctxCancel = context.WithTimeout(context.Background(), 2*time.Second)
	go suite.hub.Run(suite.ctx)
}

func (suite *HubTestSuite) TearDownSubTest() {
	suite.ctxCancel()
}

func (suite *HubTestSuite) TestRegisterClient() {
	suite.Run("2 new connections, 2 new clients registered", func() {
		ticker := time.NewTicker(time.Second)
		client := &Client{Id: "test-1", Conn: nil, hub: suite.hub}
		client2 := &Client{Id: "test-2", Conn: nil, hub: suite.hub}

		suite.hub.register <- client
		suite.hub.register <- client2

		<-ticker.C

		suite.hub.mutex.Lock()
		defer suite.hub.mutex.Unlock()
		suite.Equal(2, len(suite.hub.clients))
		suite.Equal(client, suite.hub.clients[client.Id])
		suite.Equal(client2, suite.hub.clients[client2.Id])
	})

	suite.Run("same connection try to connect again, replace existing connection with the new one", func() {
		ticker := time.NewTicker(time.Second)
		client := &Client{Id: "test-1", Conn: nil, hub: suite.hub}
		clientAgain := &Client{Id: "test-1", Conn: nil, hub: suite.hub}

		suite.hub.register <- client
		suite.hub.register <- clientAgain

		<-ticker.C

		suite.hub.mutex.Lock()
		defer suite.hub.mutex.Unlock()
		suite.Equal(1, len(suite.hub.clients))
		suite.Equal(client, suite.hub.clients[client.Id])
	})
}
