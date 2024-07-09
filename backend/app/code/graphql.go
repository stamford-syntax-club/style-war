package code

import (
	"github.com/graphql-go/graphql"
)

type GraphQL struct {
	Queries   graphql.Fields
	Mutations graphql.Fields
}

func NewGraphQL(codeRepo CodeRepo) *GraphQL {
	return &GraphQL{Queries: newGqlQueries(codeRepo)}
}

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

func newGqlQueries(codeRepo CodeRepo) graphql.Fields {
	codeQuery := &graphql.Field{
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

	queries := map[string]*graphql.Field{
		"code": codeQuery,
	}

	return queries
}
