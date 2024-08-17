import { graphql } from "@/gql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

const allChallengeQuery = graphql(`
  query AllChallenge {
    allChallenge {
      id
      imageUrl
      isActive
      objectives
    }
  }
`);

export function useAllChallenge() {
  return useQuery({
    queryKey: ["all-challenge"],
    queryFn: async () => {
      return request(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
        allChallengeQuery,
      );
    },
  });
}
