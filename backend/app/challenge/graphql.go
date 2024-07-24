package challenge

import (
	"log"
	"time"

	"github.com/graphql-go/graphql"
)

type GraphQL struct {
	Queries   graphql.Fields
	Mutations graphql.Fields
}

func NewGraphQL(challengeRepo ChallengeRepo, timerCh chan Challenge) *GraphQL {
	return &GraphQL{Queries: newGqlQueries(challengeRepo), Mutations: newGqlMutations(challengeRepo, timerCh)}
}

var gqlType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Challenge",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.ID,
		},

		"imageUrl": &graphql.Field{
			Type: graphql.String,
		},

		"objectives": &graphql.Field{
			Type: &graphql.List{OfType: graphql.String},
		},

		"isActive": &graphql.Field{
			Type: graphql.Boolean,
		},
	},
})

func newGqlQueries(challengeRepo ChallengeRepo) graphql.Fields {
	challengeQuery := &graphql.Field{
		Type: gqlType,
		Args: graphql.FieldConfigArgument{
			"id": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			return challengeRepo.GetActiveChallenge()
		},
	}

	queries := map[string]*graphql.Field{
		"challenge": challengeQuery,
	}

	return queries
}

func newGqlMutations(challengeRepo ChallengeRepo, timerCh chan Challenge) graphql.Fields {
	setActiveChallengeMutation := &graphql.Field{
		Type: gqlType,
		Args: graphql.FieldConfigArgument{
			"setActiveChallengeInput": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.NewInputObject(
					graphql.InputObjectConfig{
						Name: "SetActiveChallengeInput",
						Fields: graphql.InputObjectConfigFieldMap{
							"id": &graphql.InputObjectFieldConfig{
								Type: graphql.NewNonNull(graphql.Int),
							},
							"duration": &graphql.InputObjectFieldConfig{
								Type: graphql.NewNonNull(graphql.Int),
							},
						},
					})),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			log.Println("SetActiveChallenge is called")

			input := p.Args["setActiveChallengeInput"].(map[string]interface{})
			id := input["id"].(int)
			duration := input["duration"].(int)

			// TODO: update active challenge in db

			// start the timer
			timerCh <- Challenge{ID: id, StartTime: time.Now(), Duration: time.Duration(duration)}
			return nil, nil
		},
	}
	mutations := map[string]*graphql.Field{
		"setActiveChallenge": setActiveChallengeMutation,
	}

	return mutations
}
