package code

import (
	"github.com/graphql-go/graphql"
)

var gqlType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Code",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.ID,
		},

		"userId": &graphql.Field{
			Type: graphql.String,
		},

		"code": &graphql.Field{
			Type: graphql.String,
		},

		"challengeId": &graphql.Field{
			Type: graphql.Int,
		},
	},
})

func NewGqlQuery(codeRepo *CodeRepoImpl) *graphql.Field {
	return &graphql.Field{
		Type: gqlType,
		Args: graphql.FieldConfigArgument{
			"id": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			return Code{
				ID:          1,
				UserId:      "abc123",
				Code:        "<html></html>",
				ChallengeId: 1,
			}, nil
		},
	}
}
