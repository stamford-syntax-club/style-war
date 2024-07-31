import { Container, Flex, Notification, rem, Loader } from "@mantine/core";
import CodeEditor from "@/components/code-editor";
import Preview from "@/components/preview";
import { useEffect, useState } from "react";
import { useSocket } from "@/lib/websocket/ws";
import { useCode } from "@/lib/data-hooks/use-code";
import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

interface Message {
  event: string;
  remainingTime: number;
}

export default function Playground() {
  const { data: codeData, isLoading, isError } = useCode(1);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isConnection, setIsConnection] = useState(true);
  const [showNotification, setShowNotification] = useState<{
    show: boolean;
    message: string;
    color: string;
  }>({ show: true, message: "Trying to connect to backend :P", color: "none" });
  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

  const [value, setValue] = useState(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

    <style>
        // Add your custom styles here
    </style>
  </head>
  <body>
    <h1> Edit your code here </h1>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
  </body>
</html>`,
  );

  const socket = useSocket((message) => {
    try {
      const msg = JSON.parse(message.data) as Message;
      console.log("Received message:", msg);
      setRemainingTime(msg.remainingTime);
    } catch (error) {
      console.warn("Failed to parse message:", error, "Data:", message.data);
    }
  });

  // TODO:  this logic can be simplified into what's shown in lib/websocket/ws.ts
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const checkConnection = () => {
      if (socket) {
        setShowNotification({
          show: true,
          message: "Connected to backend ^.^",
          color: "green",
        });
        setIsConnection(false);
      } else if (isError) {
        setShowNotification({
          show: true,
          message: "Failed to connect to backend TvT",
          color: "red",
        });
        setIsConnection(false);
      }
    };

    checkConnection();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [socket, isError]);

  useEffect(() => {
    if (!isConnection && showNotification.show) {
      const timer = setTimeout(() => {
        setShowNotification({ show: false, message: "", color: "none" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isConnection, showNotification.show]);

  const handleChangeValue = (newValue: string | undefined) => {
    if (!newValue) return;

    socket?.send(
      JSON.stringify({
        event: "code:edit",
        code: {
          code: newValue,
          challengeId: 1, // TODO: get from backend
        },
      }),
    );
    setValue(newValue);
  };

  return (
    <Container fluid>
      {/* notification box */}
      {showNotification.show && (
        <Notification
          icon={
            isConnection ? (
              <Loader color="blue" />
            ) : showNotification.color === "green" ? (
              checkIcon
            ) : (
              xIcon
            )
          }
          color={showNotification.color}
          title={
            isConnection
              ? "Connecting na! wait"
              : showNotification.color === "green"
                ? "Success"
                : "Error"
          }
          onClose={() =>
            setShowNotification((prev) => ({
              ...prev,
              show: false,
            }))
          }
          styles={{
            root: {
              position: "fixed",
              bottom: rem(16),
              right: rem(16),
              zIndex: 1000,
            },
          }}
        >
          {showNotification.message}
        </Notification>
      )}
      <Flex justify="center" gap="md" align="center" mt="md">
        <CodeEditor
          value={value}
          onChange={handleChangeValue}
          remainingTime={remainingTime}
        />
        <Preview value={value} />
      </Flex>
    </Container>
  );
}
