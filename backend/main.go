package main

import (
	"fmt"

	"github.com/graphql-go/graphql"
)

func main() {
	fmt.Println("Hello World")
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
			Type: graphql.String,
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
		if id, ok := p.Args["id"].(int); ok {
			return people[id-1], nil
		}
		return nil, nil
	},
}
