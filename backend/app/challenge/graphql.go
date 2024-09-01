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
			Type: graphql.Int,
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

	allChallengeQuery := &graphql.Field{
		Type: &graphql.List{OfType: gqlType},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			return challengeRepo.GetAllChallenges()
		},
	}

	queries := map[string]*graphql.Field{
		"allChallenge": allChallengeQuery,
		"challenge":    challengeQuery,
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

			startTime := time.Now()
			// TODO: update active challenge in db
			challengeRepo.SetActiveChallenge(id, startTime, duration)

			// start the timer
			// extra 15 seconds to prevent the case where client's code update interval came after the expiration
			timerCh <- Challenge{ID: id, StartTime: startTime, Duration: time.Duration(duration)}
			return nil, nil
		},
	}
	mutations := map[string]*graphql.Field{
		"setActiveChallenge": setActiveChallengeMutation,
	}

	return mutations
}
