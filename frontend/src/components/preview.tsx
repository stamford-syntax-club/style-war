import { List, Paper, Title, Box, Flex } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useChallenge } from "@/lib/data-hooks/use-challenge";
import Challenge from "@/pages/challenge";

interface PreviewProps {
  value: string;
}

export default function Preview({ value }: PreviewProps) {
  return (
    <Box className="min-w-[40%]">
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
