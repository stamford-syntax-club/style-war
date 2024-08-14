import { useSetActiveChallenge } from "@/lib/data-hooks/use-set-challenge";
import { useSocket } from "@/lib/websocket/ws";
import { Button, Container, Text, Flex, Card, Box, Title } from "@mantine/core";
import { useState } from "react";
import Dropdown from "@/components/tasks-dropdown";

interface Message {
  event: string;
  code: { code: string; userId: string };
  remainingTime: number;
}

export default function AdminPage() {
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [remainingTime, setRemainingTime] = useState(0);
  const { mutate } = useSetActiveChallenge();

  useSocket((message) => {
    try {
      const msg = JSON.parse(message.data) as Message;
      if (msg.event === "timer:status") {
        console.log("remaning time", msg.remainingTime);
        setRemainingTime(msg.remainingTime);
      }

      if (msg.event === "code:edit") {
        console.log(msg);
        setCodes((prev) => {
          return {
            ...prev,
            [msg.code.userId]: msg.code.code,
          };
        });
      }
    } catch (error) {
      console.warn("Failed to parse message:", error, "Data:", message.data);
    }
  }, "admin");

  return (
    <Container fluid>
      <Box className="sticky top-[58px] bg-neutral-900 rounded-2xl h-16 content-center">
        <Flex justify="space-evenly" align="center">
          <Dropdown />
          <Button
            onClick={() => {
              mutate({ id: 1, duration: 2 });
            }}
            w={165}
            size="md"
          >
            Start
          </Button>
          <Text className="text-2xl">Remaining Time: {remainingTime}</Text>
        </Flex>
      </Box>
      <Flex align="center" justify="center" wrap="wrap">
        {Object.entries(codes).map(([userId, code]) => (
          <Card
            key={`${userId}-code`}
            className="flex justify-center items-center m-2 w-[700px] h-[450px] bg-neutral-900 text-white relative"
          >
            <Text fw={500}>{userId}</Text>
            <iframe
              title="preview"
              srcDoc={code}
              style={{ width: "100%", height: 400, border: "none" }}
            />
          </Card>
        ))}
      </Flex>
    </Container>
  );
}

{
  /* <div className="flex sticky top-14 z-10">
        <div className=" bg-black rounded-2xl w-full h-16 content-center">
          <Grid mt={8}>
            <GridCol span={4}>
              <Button
                onClick={() => {
                  mutate({ id: 1, duration: 1 });
                }}
              >
                Start!
              </Button>
            </GridCol>

            <GridCol span={4}>
              <Text ta="center" fw={700} size="28px">
                Admin Panel
              </Text>
            </GridCol>

            <GridCol span={4}>
              <Text size="24px" pl="20px">
                Remaining Time: {remainingTime}
              </Text>
            </GridCol>
          </Grid>
        </div>
      </div> */
}

// <Grid.Col
// span={4}
// style={{
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   flexDirection: "column",
// }}
// >
// <Text size="28px" fw={700} mb="md" td="center">
//   TIMER
// </Text>
// <Text size="24px" td="center">
//   {remainingTime}
// </Text>
// </Grid.Col>
{
  /* <div className="flex mt-6">
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
      </div> */
}
