package main

import (
	"log"
	"net/http"

	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"
)

func main() {
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

var queryType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Query",
	Fields: graphql.Fields{
		"challenge": challengeQuery,
	},
})

type Challenge struct {
	ID         int      `json:"id"`
	ImageUrl   string   `json:"imageUrl"`
	Objectives []string `json:"objectives"`
	IsActive   bool     `json:"isActive"`
}

var challengeType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Challenge",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.ID,
		},

		"imageUrl": &graphql.Field{
			Type: graphql.String,
		},

		"objectives": &graphql.Field{
			Type: &graphql.Interface{},
		},

		"isActive": &graphql.Field{
			Type: graphql.Boolean,
		},
	},
})

var challengeQuery = &graphql.Field{
	Type: challengeType,
	Args: graphql.FieldConfigArgument{
		"id": &graphql.ArgumentConfig{
			Type: graphql.Int,
		},
	},
	Resolve: func(p graphql.ResolveParams) (interface{}, error) {
		return Challenge{
			ID:       1,
			ImageUrl: "",
			Objectives: []string{
				"obj1",
				"obj2",
			},
			IsActive: true,
		}, nil
	},
}
