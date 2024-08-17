import { graphql } from "@/gql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

const codeForChallengeQuery = graphql(`
  query CodeForChallenge($challengeId: Int!) {
    codeForChallenge(challenge_id: $challengeId) {
      id
      code
      challengeId
      userId
    }
  }
`);

export function useCodeForChallenge(challengeId: number) {
  return useQuery({
    queryKey: ["code-for-challenge", challengeId],
    queryFn: async () => {
      return request(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
        codeForChallengeQuery,
        { challengeId },
      );
    },
  });
}
