package websocket

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"net/url"
	"sync"
	"testing"
	"time"

	"github.com/gorilla/websocket"
	"github.com/stamford-syntax-club/style-war/backend/app/challenge"
	challenge_mock "github.com/stamford-syntax-club/style-war/backend/app/challenge/mocks"
	"github.com/stamford-syntax-club/style-war/backend/app/code"
	code_mock "github.com/stamford-syntax-club/style-war/backend/app/code/mocks"
	"github.com/stretchr/testify/suite"
)

type HubTestSuite struct {
	ctx       context.Context
	ctxCancel context.CancelFunc

	hub           *Hub
	codeRepo      *code_mock.CodeRepo
	challengeRepo *challenge_mock.ChallengeRepo

	suite.Suite

	mutex sync.Mutex
}

func TestHubSuite(t *testing.T) {
	suite.Run(t, new(HubTestSuite))
}

var endDate, _ = time.Parse("yyyy-mm-dd", "2024-07-09")

// setup dependecies before running each test
func (suite *HubTestSuite) SetupSubTest() {
	suite.challengeRepo = challenge_mock.NewChallengeRepo(suite.Suite.T())
	suite.codeRepo = code_mock.NewCodeRepo(suite.Suite.T())
	suite.challengeRepo.On("GetAllChallenges", "id", "end").Return([]challenge.Challenge{
		{
			ID:  1,
			End: endDate,
		},
		{
			ID:  2,
			End: endDate,
		},
	}, nil)
	suite.hub = NewHub(suite.codeRepo, suite.challengeRepo)
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

func (suite *HubTestSuite) TestSyncChallengeExpiration() {
	suite.Run("set end date correctly", func() {
		ticker := time.NewTicker(time.Second)
		testHub := NewHub(suite.codeRepo, suite.challengeRepo)

		testHub.syncChallengeExpiration()

		<-ticker.C
		suite.Equal(testHub.challengeExpiration[0], endDate)
		suite.Equal(testHub.challengeExpiration[1], endDate)
	})

	suite.Run("empty expiration map if error when getting active challenges", func() {
		ticker := time.NewTicker(time.Second)
		mockChallRepo := challenge_mock.NewChallengeRepo(suite.T())
		mockChallRepo.On("GetAllChallenges", "id", "end").Return(nil, errors.New("test error"))
		testHub := NewHub(suite.codeRepo, mockChallRepo)

		testHub.syncChallengeExpiration()

		<-ticker.C
		suite.Empty(testHub.challengeExpiration)
	})
}

func (suite *HubTestSuite) TestHandleMessage() {
	testHub := NewHub(suite.codeRepo, suite.challengeRepo)
	suite.Run("CODE EDIT", func() {
		tests := []struct {
			name             string
			msg              *Msg
			expectedResponse interface{}
			shouldBeExpired  bool
			isAdmin          bool
		}{
			{
				name:             "acknowledge submission if not pass submission deadline",
				msg:              &Msg{Event: "code:edit", Code: &code.Code{UserId: "test-good-khing", Code: "hi", ChallengeId: 1234}},
				expectedResponse: "Submission from test-good-khing for challenge 1234 received!",
			},
			{
				name:             "broadcast to admin if not nil",
				msg:              &Msg{Event: "code:edit", Code: &code.Code{UserId: "test-good-khing", Code: "hi", ChallengeId: 1234}},
				expectedResponse: &Msg{Event: "code:edit", Code: &code.Code{UserId: "test-good-khing", Code: "hi", ChallengeId: 1234}},
				isAdmin:          true,
			},
			{
				name:             "reject submission if exceed submission deadline",
				msg:              &Msg{Event: "code:edit", Code: &code.Code{UserId: "test-good-khing", Code: "hi", ChallengeId: 1234}},
				expectedResponse: "Time is up!",
				shouldBeExpired:  true,
			},
		}

		for _, test := range tests {
			suite.Run("CODE-EDIT: "+test.name, func() {
				server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
					upgrader := websocket.Upgrader{}
					conn, err := upgrader.Upgrade(w, r, nil)
					suite.NoError(err)
					defer conn.Close()
					for {
						_, message, _ := conn.ReadMessage()
						suite.mutex.Lock()
						defer suite.mutex.Unlock()
						if test.isAdmin {
							var message Msg
							json.Marshal(&message)
							suite.Equal(test.expectedResponse, message)
						} else {
							suite.Equal(test.expectedResponse, string(message))
						}
					}
				}))
				defer server.Close()

				url, err := url.Parse(server.URL)
				suite.NoError(err)
				url.Scheme = "ws"
				conn, _, err := websocket.DefaultDialer.Dial(url.String(), nil)
				client := NewClient(test.msg.Code.UserId, conn, testHub)
				testHub.registerClient(client)
				testHub.mutex.Lock()
				if test.shouldBeExpired {
					testHub.challengeExpiration[test.msg.Code.ChallengeId] = endDate
				} else {
					testHub.challengeExpiration[test.msg.Code.ChallengeId] = time.Now().Add(time.Hour)
				}
				if test.isAdmin {
					testHub.admin = conn
				}
				testHub.mutex.Unlock()

				testHub.handleMessage(test.msg)
			})
		}
	})

}
