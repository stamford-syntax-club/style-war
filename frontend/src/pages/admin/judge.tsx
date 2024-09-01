import CodeCard from "@/components/code-card";
import Preview from "@/components/preview";
import { useAllChallenge } from "@/lib/data-hooks/use-all-challenge";
import { useCodeForChallenge } from "@/lib/data-hooks/use-all-code-for-challenge";
import { Flex, Card, Text, Select } from "@mantine/core";
import { useState } from "react";

export default function AdminJudgingPage() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const { data: allChallengeData } = useAllChallenge();
  const {
    data: codeForChallengeData,
    isLoading,
    isError,
    error,
  } = useCodeForChallenge(currentChallenge);
  return (
    <div>
      {allChallengeData?.allChallenge && (
        <Select
          label="View Code Submission For Challenge Id:"
          onChange={(value) => {
            if (value) setCurrentChallenge(parseInt(value));
          }}
          data={
            allChallengeData.allChallenge.map((challenge) => {
              return {
                label:
                  `${challenge?.id?.toString()}${challenge?.isActive ? "-active" : ""}` ||
                  "",
                value: challenge?.id?.toString() || "",
              };
            }) || []
          }
        />
      )}

      {isError && error.message}
      {!isLoading && (
        <Flex align="center" justify="center" wrap="wrap" mt="sm">
          {codeForChallengeData?.codeForChallenge?.map((code) => (
            <CodeCard userId={code?.userId || ""} code={code?.code || ""} />
          ))}
        </Flex>
      )}
    </div>
  );
}
