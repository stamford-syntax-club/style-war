package graphql

import (
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"
	"github.com/stamford-syntax-club/style-war/backend/common"
)

func registerQueries(challengeQuery *graphql.Field, codeQuery *graphql.Field) *graphql.Object {
	return graphql.NewObject(graphql.ObjectConfig{
		Name: "Query",
		Fields: graphql.Fields{
			"challenge": challengeQuery,
			"code":      codeQuery,
		},
	})
}

func CreateHandler(challengeQuery *graphql.Field, codeQuery *graphql.Field) gin.HandlerFunc {
	schema, err := graphql.NewSchema(graphql.SchemaConfig{
		Query: registerQueries(challengeQuery, codeQuery),
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

			result := graphql.Do(graphql.Params{
				Schema:        schema,
				RequestString: payload["query"].(string),
				Context:       context.WithValue(context.Background(), "currentUser", userId),
			})
			if len(result.Errors) > 0 {
				log.Printf("wrong result, unexpected errors: %v", result.Errors)
				c.AbortWithError(http.StatusBadRequest, result.Errors[0])
			}

			c.JSON(http.StatusOK, result)
		}
	}
}
