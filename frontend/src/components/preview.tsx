import { Paper, Box, Text } from "@mantine/core";
interface PreviewProps {
  value: string;
}

export default function Preview({ value }: PreviewProps) {
  return (
    <Box>
      <Paper className=" w-[540px] h-[720px] border bg-neutral-900 p-1 overflow-hidden">
        <Text ta="center"> 540x720px</Text>
        <iframe
          title="preview"
          srcDoc={value}
          className="w-full h-full  border-none"
        />
      </Paper>
    </Box>
  );
}
