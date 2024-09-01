import { Code, Text, Button, Card } from "@mantine/core";
import { useState } from "react";
import Preview from "./preview";

export default function CodeCard({
  userId,
  code,
}: {
  userId: string;
  code: string;
}) {
  const [viewModes, setViewModes] = useState<
    Record<string, "rendered" | "source">
  >({});
  const toggleViewMode = (userId: string) => {
    setViewModes((prev) => ({
      ...prev,
      [userId]: prev[userId] === "rendered" ? "source" : "rendered",
    }));
  };
  return (
    <Card key={`${userId}-code`}>
      <Text fw={500}>{userId}</Text>
      <Button
        onClick={() => toggleViewMode(userId)}
        className="absolute top-2 right-4 h-[30px] w-[120px]"
      >
        Source
      </Button>
      {viewModes[userId] === "source" ? (
        <Code block w={540} h={735}>
          {code}
        </Code>
      ) : (
        <Preview value={code} />
      )}
    </Card>
  );
}
