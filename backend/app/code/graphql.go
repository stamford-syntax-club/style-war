package code

import (
	"errors"

	"github.com/graphql-go/graphql"
)

type GraphQL struct {
	Queries   graphql.Fields
	Mutations graphql.Fields
}

func NewGraphQL(codeRepo CodeRepo) *GraphQL {
	return &GraphQL{Queries: newGqlQueries(codeRepo), Mutations: newGqlMutations(codeRepo)}
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

func newGqlMutations(codeRepo CodeRepo) graphql.Fields {
	storeCodeMutations := &graphql.Field{
		Type: gqlType,
		Args: graphql.FieldConfigArgument{
			"storeCodeInput": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.NewInputObject(
					graphql.InputObjectConfig{
						Name: "StoreCodeInput",
						Fields: graphql.InputObjectConfigFieldMap{
							"challenge_id": &graphql.InputObjectFieldConfig{
								Type: graphql.NewNonNull(graphql.Int),
							},
							"code": &graphql.InputObjectFieldConfig{
								Type: graphql.NewNonNull(graphql.String),
							},
						},
					},
				)),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			userId := p.Context.Value("currentUser").(string)
			if userId == "" {
				return nil, errors.New("missing userId")
			}

			input := p.Args["storeCodeInput"].(map[string]interface{})
			challengeId := input["challenge_id"].(int)
			code := input["code"].(string)
			return codeRepo.StoreCode(Code{ChallengeId: challengeId, Code: code, UserId: userId})
		},
	}

	mutations := map[string]*graphql.Field{
		"storeCode": storeCodeMutations,
	}

	return mutations
}
