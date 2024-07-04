package graphql

import "github.com/graphql-go/graphql"

var queryType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Query",
	Fields: graphql.Fields{
		"challenge": challengeQuery,
	},
})
