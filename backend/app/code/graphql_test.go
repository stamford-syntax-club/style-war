package code

import (
	"testing"
)

func TestCodeQuery(t *testing.T) {
	// codeQuries := newGqlQueries(codeRepo.GetCode())
	// queryType := graphql.NewObject(graphql.ObjectConfig{
	// 	Name: "Query",
	// 	Fields: graphql.Fields{
	// 		"code": codeQuery,
	// 	},
	// })
	//
	// schema, err := graphql.NewSchema(graphql.SchemaConfig{
	// 	Query: queryType,
	// })
	// if err != nil {
	// 	log.Fatalf("An error has occured while pasrsing GrahpQL schema: %s", err)
	// }
	//
	// query := `
	//        {
	//            code {
	//                code
	//                challengeId
	//            }
	//        }
	//    `
	// params := graphql.Params{Schema: schema, RequestString: query}
	// resp := graphql.Do(params)
	// code, err := common.ConvertGqlDataTo[Code]("code", resp.Data)
	//
	// assert.Empty(t, resp.Errors)
	// assert.NoError(t, err)
	// assert.Equal(t, "<html></html>", code.Code)
	// assert.Equal(t, 1, code.ChallengeId)
}
