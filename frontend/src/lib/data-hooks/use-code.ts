import { graphql } from "@/gql";
import { useSession } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";

const codeQuery = graphql(`
  query Code($challengeId: Int!) {
    code(challengeId: $challengeId) {
      id
      code
      challengeId
      userId
    }
  }
`);

export function useCode(challengeId: number) {
  const { session, isLoaded } = useSession();

  return useQuery({
    queryKey: ["code", challengeId, isLoaded],
    queryFn: async () => {
      const token = await session
        ?.getToken({ template: "style-wars" })
        .then((token) => token || "");

      return request(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
        codeQuery,
        { challengeId },
        { Authorization: `Bearer ${token}` },
      );
    },
  });
}
