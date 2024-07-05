package graphql

import (
	"log"
	"net/http"

	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"
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

func CreateHandler(challengeQuery *graphql.Field, codeQuery *graphql.Field) http.Handler {
	schema, err := graphql.NewSchema(graphql.SchemaConfig{
		Query: registerQueries(challengeQuery, codeQuery),
	})
	if err != nil {
		log.Fatalf("An error has occured while pasrsing GrahpQL schema: %s", err)
	}

	h := handler.New(&handler.Config{
		Schema:     &schema,
		Pretty:     true,
		Playground: true,
	})

	return h
}
