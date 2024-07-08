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

func (suite *HubTestSuite) TestUnregisterClient() {
	client := &Client{Id: "test-1", Conn: nil, hub: suite.hub}
	client2 := &Client{Id: "test-2", Conn: nil, hub: suite.hub}
	suite.Run("client is unregistered from hub when disconnect", func() {
		ticker := time.NewTicker(time.Second)
		suite.hub.clients = map[string]*Client{client.Id: client, client2.Id: client2}

		suite.hub.unregister <- client

		<-ticker.C
		suite.hub.mutex.Lock()
		defer suite.hub.mutex.Unlock()
		suite.Equal(1, len(suite.hub.clients))
		suite.Nil(suite.hub.clients[client.Id])     // client 1 is removed successfully
		suite.NotNil(suite.hub.clients[client2.Id]) // client 2 stays
	})

	suite.Run("tolerate unregistering user who never connected before", func() {
		ticker := time.NewTicker(time.Second)
		client3 := &Client{Id: "test-3", Conn: nil, hub: suite.hub} // this guy is not in hub.clients
		suite.hub.clients = map[string]*Client{client.Id: client, client2.Id: client2}

		suite.hub.unregister <- client3

		<-ticker.C

		suite.hub.mutex.Lock()
		defer suite.hub.mutex.Unlock()
		suite.Equal(2, len(suite.hub.clients))
		suite.NotNil(suite.hub.clients[client.Id])  // client 1 stays
		suite.NotNil(suite.hub.clients[client2.Id]) // client 2 stays
	})
}
