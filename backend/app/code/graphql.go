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

func NewGqlQuery(codeRepo CodeRepo) *graphql.Field {
	return &graphql.Field{
		Type: gqlType,
		Args: graphql.FieldConfigArgument{
			"challenge_id": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			challengeId := p.Args["challenge_id"].(int)
			userId := p.Context.Value("currentUser").(string)
			return codeRepo.GetCode(challengeId, userId)
		},
	}
}
