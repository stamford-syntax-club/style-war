import { Flex, Title, Select, Modal, Text, Button } from "@mantine/core";
import CodeEditor from "@/components/code-editor";
import Preview from "@/components/preview";
import { useEffect, useState } from "react";
import { useSocket } from "@/lib/websocket/ws";
import { useCode } from "@/lib/data-hooks/use-code";
import { useSearchParams } from "next/navigation";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
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
  const [cssType, setCssType] = useState<string>("normal");
  const [pendingCSSType, setPendingCSSType] = useState("");

  const cssOptions = (cssType: string) => {
    let cdn = "";

    switch (cssType) {
      case "tailwind":
        cdn = `<script src="https://cdn.tailwindcss.com"></script>`;
        break;
      case "bootstrap":
        cdn = `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">`;
        break;
      default:
        break;
    }

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${cdn}
    <style>
        /* Add your custom styles here */
    </style>
  </head>
  <body>
    <h1>Edit your code here</h1>
    <p>Choose the type of css you want to use from the dropdown above</p>
    <p>Good Luck! Have Fun 🚀</p>
  </body>
</html>`;
  };

  const [value, setValue] = useState(cssOptions(cssType));
  const [debouncedValue] = useDebouncedValue(value, 1000);

  const [opened, { open, close }] = useDisclosure();

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
      title: "Code Loaded",
      message: "Your code has been loaded successfully.",
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
      }),
    );

    setIsSaved(true);
  }, [debouncedValue]);

  useEffect(() => {
    setValue(cssOptions(cssType));
    setIsSaved(false);
  }, [cssType]);

  const handleChangeValue = (newValue: string | undefined) => {
    if (!newValue) return;
    setIsSaved(false);
    setValue(newValue);
  };

  return (
    <Flex direction="column">
      <Title order={4} className="text-gray-400">
        {remainingTime === 0
          ? "Time's up!"
          : remainingTime !== null
            ? `Remaining Time: ${remainingTime}s`
            : "Waiting for admin to start next challenge..."}
      </Title>

      <Flex align="end" direction="row" gap="md" mb="md">
        <Select
          label="Choose CSS type"
          value={cssType}
          onChange={(cssType) => {
            setPendingCSSType(cssType || "normal");
            open();
          }}
          data={[
            { value: "normal", label: "Normal CSS" },
            { value: "tailwind", label: "Tailwind CSS" },
            { value: "bootstrap", label: "Bootstrap CSS" },
          ]}
        />
        <Challenge
          objectives={activeChallengeData?.challenge?.objectives ?? [""]}
          isActive={activeChallengeData?.challenge?.isActive ?? true}
          imageUrl={activeChallengeData?.challenge?.imageUrl ?? ""}
        />

        {isSaved ? "Changes saved!" : ""}
      </Flex>
      <Modal opened={opened} onClose={close} title="Changing CSS Type">
        <Flex direction="column" gap="lg" align="center">
          <Text>
            Changing the CSS Type to `{pendingCSSType}` will erase your current
            code. Are you sure you want to do it?
          </Text>
          <Flex direction="row" gap="md">
            <Button
              onClick={() => {
                setCssType(pendingCSSType);
                setPendingCSSType("normal");
                close();
              }}
            >
              Yes - change it
            </Button>
            <Button
              variant="subtle"
              onClick={() => {
                close();
              }}
            >
              No - take me back
            </Button>
          </Flex>
        </Flex>
      </Modal>

      <Flex gap="md">
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
