package graphql

import (
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"
	"github.com/stamford-syntax-club/style-war/backend/app/challenge"
	"github.com/stamford-syntax-club/style-war/backend/app/code"
	"github.com/stamford-syntax-club/style-war/backend/common"
)

// Helper function to merge multiple graphql.Fields into one
func mergeFields(fields ...graphql.Fields) graphql.Fields {
	merged := graphql.Fields{}
	for _, field := range fields {
		for key, value := range field {
			merged[key] = value
		}
	}
	return merged
}

func registerQueries(queries ...graphql.Fields) *graphql.Object {
	return graphql.NewObject(graphql.ObjectConfig{
		Name:   "Query",
		Fields: mergeFields(queries...),
	})
}

func registerMutations(mutations ...graphql.Fields) *graphql.Object {
	mutationObj := graphql.NewObject(graphql.ObjectConfig{
		Name:   "Mutation",
		Fields: mergeFields(mutations...),
	})

	return mutationObj
}

func CreateHandler(challengeGraphQL *challenge.GraphQL, codeGraphQL *code.GraphQL) gin.HandlerFunc {
	schema, err := graphql.NewSchema(graphql.SchemaConfig{
		Query:    registerQueries(challengeGraphQL.Queries, codeGraphQL.Queries),
		Mutation: registerMutations(challengeGraphQL.Mutations, codeGraphQL.Mutations),
	})
	if err != nil {
		log.Fatalf("An error has occured while pasrsing GrahpQL schema: %s", err)
	}

	return func(c *gin.Context) {
		if c.Request.Method == http.MethodGet {
			h := handler.New(&handler.Config{
				Schema:     &schema,
				Pretty:     true,
				Playground: true,
			})
			h.ServeHTTP(c.Writer, c.Request)

		} else if c.Request.Method == http.MethodPost {
			userId := common.ExtractUserId(c)

			var payload map[string]interface{}
			if err := c.ShouldBindJSON(&payload); err != nil {
				c.AbortWithError(http.StatusBadRequest, err)
			}

			params := graphql.Params{
				Schema:        schema,
				RequestString: payload["query"].(string),
				Context:       context.WithValue(context.Background(), "currentUser", userId),
			}
			if variables, ok := payload["variables"].(map[string]interface{}); ok {
				params.VariableValues = variables
			}

			result := graphql.Do(params)
			if len(result.Errors) > 0 {
				log.Printf("wrong result, unexpected errors: %v", result.Errors)
				c.AbortWithError(http.StatusBadRequest, result.Errors[0])
			}

			c.JSON(http.StatusOK, result)
		}
	}
}
