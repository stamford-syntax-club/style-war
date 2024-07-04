package graphql

import "github.com/graphql-go/graphql"

type Challenge struct {
	ID         int      `json:"id"`
	ImageUrl   string   `json:"imageUrl"`
	Objectives []string `json:"objectives"`
	IsActive   bool     `json:"isActive"`
}

var challengeType = graphql.NewObject(graphql.ObjectConfig{
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

var challengeQuery = &graphql.Field{
	Type: challengeType,
	Args: graphql.FieldConfigArgument{
		"id": &graphql.ArgumentConfig{
			Type: graphql.Int,
		},
	},
	Resolve: func(p graphql.ResolveParams) (interface{}, error) {
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
