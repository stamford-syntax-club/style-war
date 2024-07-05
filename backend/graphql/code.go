package graphql

import (
	"github.com/graphql-go/graphql"
)

type Code struct {
	ID          int    `json:"id"`
	UserId      string `json:"userId"`
	Code        string `json:"code"`
	ChallengeId int    `json:"challengeId"`
}

var codeType = graphql.NewObject(graphql.ObjectConfig{
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

var codeQuery = &graphql.Field{
	Type: codeType,
	Args: graphql.FieldConfigArgument{
		"challengeId": &graphql.ArgumentConfig{
			Type: graphql.Int,
		},
	},
	Resolve: func(p graphql.ResolveParams) (interface{}, error) {
		challengeId := p.Args["challengeId"].(int)
		return Code{
			ID:          1,
			UserId:      "abc123",
			Code:        "<html></html>",
			ChallengeId: challengeId,
		}, nil
	},
}
