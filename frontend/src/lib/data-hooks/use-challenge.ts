import { graphql } from "@/gql";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

const codeQuery = graphql(`
    query Challenge {
    challenge {
        imageUrl
        isActive
        objectives
    }
}
`);

export function useChallenge() {

  return useQuery({
    queryKey: ["challenge"],
    queryFn: async () => {
      return request(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
        codeQuery,
      );
    },
  });
}
