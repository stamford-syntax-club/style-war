import { List, Paper, Title, Box, Flex } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useChallenge } from "@/lib/data-hooks/use-challenge";
import Challenge from "@/pages/challenge";

interface PreviewProps {
  value: string;
}

export default function Preview({ value }: PreviewProps) {
  const {
    data: challengeData,
    isLoading: loadingChallnge,
    isError: errorChallenge,
  } = useChallenge();

  return (
    <Box className="min-w-[40%]">
      <Flex direction="row">
        <Title>Preview</Title>
        <Challenge
          objectives={challengeData?.challenge?.objectives ?? [""]}
          isActive={challengeData?.challenge?.isActive ?? true}
          imageUrl={challengeData?.challenge?.imageUrl ?? ""}
        />
      </Flex>
      <Paper className="min-h-[80vh] border bg-neutral-900 p-1 overflow-hidden">
        <iframe
          title="preview"
          srcDoc={value}
          className="w-full min-h-[80vh] border-none"
        />
      </Paper>
    </Box>
  );
}
