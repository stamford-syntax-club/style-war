package challenge

import (
	"log"

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

func NewGqlQuery(challengeRepo ChallengeRepo) *graphql.Field {
	return &graphql.Field{
		Type: gqlType,
		Args: graphql.FieldConfigArgument{
			"id": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			log.Println("context currentUser contains...: ", p.Context.Value("currentUser"))
			return challengeRepo.GetActiveChallenge()
		},
	}
}
