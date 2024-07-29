import { Container, Flex, Notification, rem } from "@mantine/core";
import CodeEditor from "@/components/code-editor";
import Preview from "@/components/preview";
import { useEffect, useState } from "react";
import { useSocket } from "@/lib/websocket/ws";
import { useCode } from "@/lib/data-hooks/use-code";
import { IconCheck, IconX } from "@tabler/icons-react";

interface Message {
  event: string;
  remainingTime: number;
}

export default function Playground() {
  const { data: codeData, isLoading, isError } = useCode(1);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState<{
    show: boolean;
    message: string;
    color: string;
  }>({ show: false, message: "", color: "" });
  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

  const [value, setValue] = useState(
    `<!DOCTYPE html>
<html>
    <head>
        <style></style>
    </head> <body> 
    </body>
</html>`
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

  useEffect(() => {
    // if (socket) {
    // 	setShowNotification({
    // 		show: true,
    // 		message: "Connected to the backend!",
    // 		color: "green",
    // 	});
    // } else if (isError || !socket) {
    // 	setShowNotification({
    // 		show: true,
    // 		message: "Failed to connect to the backend!",
    // 		color: "red",
    // 	});
    // }

    try {
      if (socket) {
        setShowNotification({
          show: true,
          message: "Connected to the backend!",
          color: "green",
        });
      }
    } catch (isError) {
      setShowNotification({
        show: true,
        message: "Failed to connect to the backend!",
        color: "red",
      });
    }

    const timer = setTimeout(() => {
      setShowNotification((prev) => ({ ...prev, show: false }));
    }, 5000);

    return () => clearTimeout(timer);
  }, [socket, isError]);

  const handleChangeValue = (newValue: string | undefined) => {
    if (!newValue) return;

    socket?.send(
      JSON.stringify({
        event: "code:edit",
        code: {
          code: newValue,
          challengeId: 1, // TODO: get from backend
        },
      })
    );
    setValue(newValue);
  };

  return (
    <Container fluid>
      {/* notification box */}
      {showNotification.show && (
        <Notification
          icon={showNotification.color === "green" ? checkIcon : xIcon}
          color={showNotification.color}
          title={
            showNotification.color === "green" ? "All Good!" : "Opps! Bummer"
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
