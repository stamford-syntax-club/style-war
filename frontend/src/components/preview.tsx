import { Paper, Title, Box, Button, Flex } from "@mantine/core";
import Link from "next/link";

interface PreviewProps {
  value: string;
}

export default function Preview({ value }: PreviewProps) {
  return (
    <Box className="min-w-[40%]">
      <Flex direction="row" justify="space-between">
        <Title>Preview</Title>
        <Link href="/challenge">
          <Button variant="light">View Challenge</Button>
        </Link>
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
