package challenge

import (
	"github.com/graphql-go/graphql"
)

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

func NewGqlQuery(challengeRepo *ChallengeRepoImpl) *graphql.Field {
	return &graphql.Field{
		Type: gqlType,
		Args: graphql.FieldConfigArgument{
			"id": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			// return challengeRepo.GetActiveChallenge(), nil
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
}
