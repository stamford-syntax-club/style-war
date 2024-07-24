import { graphql } from "@/gql";
import { useMutation } from "@tanstack/react-query";
import request from "graphql-request";
import { useSession } from "@clerk/nextjs";
import { SetActiveChallengeInput } from "@/gql/graphql";

const createPostQuery = graphql(`
  mutation SetActiveChallenge(
    $setActiveChallengeInput: SetActiveChallengeInput!
  ) {
    setActiveChallenge(setActiveChallengeInput: $setActiveChallengeInput) {
      id
    }
  }
`);

export function useSetActiveChallenge() {
  const { session } = useSession();

  return useMutation({
    mutationKey: ["set-active-challenge"],
    mutationFn: async (setActiveChallengeInput: SetActiveChallengeInput) => {
      const token = await session
        ?.getToken({ template: "style-wars" })
        .then((token) => token || "");

      console.log(setActiveChallengeInput);

      return request(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
        createPostQuery,
        {
          setActiveChallengeInput,
        },
        {
          Authorization: `Bearer ${token}`,
        },
      );
    },
  });
}
