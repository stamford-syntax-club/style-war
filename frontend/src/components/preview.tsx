import { List, Paper, Title, Box, Flex } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import Challenge from "@/pages/challenge";

interface PreviewProps {
  value: string;
}

export default function Preview({ value }: PreviewProps) {
  const [debouncedValue] = useDebouncedValue(value, 1000);

  return (
    <Box className="min-w-[40%]">
      <Flex direction="row">
        <Title>Preview</Title>
      </Flex>
      <Paper className="min-h-[80vh] border bg-neutral-900 p-1 overflow-hidden">
        <iframe
          title="preview"
          srcDoc={debouncedValue}
          className="w-full min-h-[80vh] border-none"
        />
      </Paper>
    </Box>
  );
}
