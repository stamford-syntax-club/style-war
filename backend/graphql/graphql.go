package graphql

import (
	"log"
	"net/http"

	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"
)

func Serve() {
	schema, err := graphql.NewSchema(graphql.SchemaConfig{
		Query: queryType,
	})
	if err != nil {
		log.Fatalf("An error has occured while pasrsing GrahpQL schema: %s", err)
	}

	h := handler.New(&handler.Config{
		Schema:     &schema,
		Pretty:     true,
		Playground: true,
	})

	http.Handle("/graphql", h)

	log.Println("Listening on port 8080")

	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatalf("An error has occured while listening on port 8080: %s", err)
	}
}
