import { useSetActiveChallenge } from "@/lib/data-hooks/use-set-challenge";
import { useSocket } from "@/lib/websocket/ws";
import {
  Button,
  Container,
  Text,
  Grid,
  Flex,
  Card,
  Center,
} from "@mantine/core";
import { useState } from "react";

interface Message {
  event: string;
  code: string;
  userId: string;
  remainingTime: number;
}

function AdminPage() {
  const [codes, setCodes] = useState<Record<string, string>>();
  useSocket((message) => {
    try {
      const msg = JSON.parse(message.data) as Message;
      if (msg.event === "timer:status") {
        setRemainingTime(msg.remainingTime);
      }

      if (msg.event === "code:edit") {
        setCodes((prev) => {
          return {
            ...prev,
            [msg.userId]: msg.code,
          };
        });
      }
    } catch (error) {
      console.warn("Failed to parse message:", error, "Data:", message.data);
    }
  }, "admin");

  const teams = new Array(6).fill("Team");
  const [remainingTime, setRemainingTime] = useState(0);
  const { mutate } = useSetActiveChallenge();

  return (
    <Container fluid>
      <Button
        onClick={() => {
          mutate({ id: 1, duration: 1 });
        }}
      >
        Start!
      </Button>
      <Text
        ta="center"
        style={{ fontSize: "26px" }}
        fw={900}
        variant="gradient"
        gradient={{ from: "blue", to: "cyan", deg: 90 }}
      >
        Admin Panel
      </Text>

      <Grid mt={15}>
        <Grid.Col
          span={8}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Flex wrap="wrap" gap="md">
            {teams.map((team, index) => (
              <Flex key={index} style={{ margin: "10px auto" }}>
                <Card
                  shadow="md"
                  padding="lg"
                  radius="md"
                  style={{
                    width: 640,
                    height: 360,
                    backgroundColor: "#3b82f6",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text td={Center} fw={700} size="lg">
                    {team} {index + 1}
                  </Text>
                </Card>
              </Flex>
            ))}
          </Flex>
        </Grid.Col>
        <Grid.Col
          span={4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Text size="28px" fw={700} mb="md" td="center">
            TIMER
          </Text>
          <Text size="24px" td="center">
            {remainingTime}
          </Text>
        </Grid.Col>
      </Grid>

      {/* <div className="flex mt-6">
        <div className="w-3/4 flex flex-wrap gap-4">
          {teams.map((team, index) => (
            <div key={index} className="flex justify-center">
              <div className="bg-blue-500 text-white w-[660px] h-[380px] p-5 text-center">
                <p className="font-bold">{team}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="w-1/4 justify-center content-center">
          <div className="text-center text-4xl font-bold p-4">TIMER</div>
          <div className="text-center text-2xl">{remainingTime}</div>
        </div>
      </div> */}
    </Container>
  );
}

export default AdminPage;
