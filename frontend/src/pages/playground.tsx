import {
  Container,
  Flex,
  Notification,
  rem,
  Loader,
  Title,
} from "@mantine/core";
import CodeEditor from "@/components/code-editor";
import Preview from "@/components/preview";
import { useEffect, useState } from "react";
import { useSocket } from "@/lib/websocket/ws";
import { useCode } from "@/lib/data-hooks/use-code";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useDebouncedValue } from "@mantine/hooks";
import { useChallenge } from "@/lib/data-hooks/use-challenge";
import { notifications } from "@mantine/notifications";
import Challenge from "./challenge";

interface Message {
  event: string;
  remainingTime: number;
}

export default function Playground() {
  const searchParams = useSearchParams();
  const { data: activeChallengeData } = useChallenge();
  const {
    data: codeData,
    isLoading,
    isError,
  } = useCode(activeChallengeData?.challenge?.id ?? 0);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const [isSaved, setIsSaved] = useState(false);

  const [value, setValue] = useState(
    !isLoading && codeData?.code?.code
      ? codeData.code.code
      : `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <!-- <script src="https://cdn.tailwindcss.com"></script> -->
    <style>
        // Add your custom styles here
    </style>
  </head>
  <body>
    <!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script> -->
    <!-- DO NOT REMOVE this line -->
    <h1> Edit your code here </h1>
    <p> Uncomment the script tags to use bootstrap & tailwind</p>

  </body>
</html>`
  );
  const [debouncedValue] = useDebouncedValue(value, 3000);

  const { socket } = useSocket((message) => {
    try {
      const msg = JSON.parse(message.data) as Message;
      console.log("Received message:", msg);
      setRemainingTime(msg.remainingTime);
    } catch (error) {
      console.warn("Failed to parse message:", error, "Data:", message.data);
    }
  });

  useEffect(() => {
    if (isLoading || !codeData?.code?.code) return;
    notifications.show({
      title: "yay",
      message: "hi",
    });

    setValue(codeData.code.code);
  }, [codeData?.code?.code]);

  useEffect(() => {
    if (!activeChallengeData?.challenge?.id) return;

    socket?.send(
      JSON.stringify({
        event: "code:edit",
        code: {
          code: debouncedValue,
          challengeId: activeChallengeData?.challenge?.id,
        },
      })
    );

    setIsSaved(true);
  }, [debouncedValue]);

  const handleChangeValue = (newValue: string | undefined) => {
    if (!newValue) return;
    setIsSaved(false);
    setValue(newValue);
  };

  return (
    <Flex direction="column" justify="center" align="center" gap="lg">
      <Title order={4} className="text-gray-400">
        {remainingTime === 0
          ? "Time's up!"
          : remainingTime !== null
          ? `Remaining Time: ${remainingTime}s`
          : "Waiting for admin to start next challenge..."}
      </Title>

      <Flex justify="center" gap="md" align="center" mb="mb">
        <Challenge
          objectives={activeChallengeData?.challenge?.objectives ?? [""]}
          isActive={activeChallengeData?.challenge?.isActive ?? true}
          imageUrl={activeChallengeData?.challenge?.imageUrl ?? ""}
        />
        {isSaved ? "changes saved!" : "saving changes"}
      </Flex>

      <Flex justify="center" gap="md" align="center">
        <CodeEditor
          value={value}
          onChange={handleChangeValue}
          remainingTime={
            searchParams.get("mode") === "dev" ? 999999999999 : remainingTime
          }
        />
        <Preview value={value} />
      </Flex>
    </Flex>
  );
}
