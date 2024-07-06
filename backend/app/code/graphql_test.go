package code

import (
	"log"
	"testing"

	"github.com/graphql-go/graphql"
	"github.com/stamford-syntax-club/style-war/backend/common"
	"github.com/stretchr/testify/assert"
)

// It is considered to be of type "CodeRepo" since
// it contains the methods declared in the CodeRepo interface
// Mock to avoid actual database connection
type MockCodeRepo struct{}

func (cr *MockCodeRepo) GetCode() *Code {
	return &Code{}
}

func TestCodeQuery(t *testing.T) {
	codeRepo := &MockCodeRepo{}
	codeQuery := NewGqlQuery(codeRepo)
	queryType := graphql.NewObject(graphql.ObjectConfig{
		Name: "Query",
		Fields: graphql.Fields{
			"code": codeQuery,
		},
	})

	schema, err := graphql.NewSchema(graphql.SchemaConfig{
		Query: queryType,
	})
	if err != nil {
		log.Fatalf("An error has occured while pasrsing GrahpQL schema: %s", err)
	}

	query := `
        {
            code {
                code
                challengeId
            }
        }
    `
	params := graphql.Params{Schema: schema, RequestString: query}
	resp := graphql.Do(params)
	code, err := common.ConvertGqlDataTo[Code]("code", resp.Data)

	assert.Empty(t, resp.Errors)
	assert.NoError(t, err)
	assert.Equal(t, "<html></html>", code.Code)
	assert.Equal(t, 1, code.ChallengeId)
}
