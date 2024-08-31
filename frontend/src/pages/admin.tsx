import { useSetActiveChallenge } from "@/lib/data-hooks/use-set-challenge";
import { useSocket } from "@/lib/websocket/ws";
import {
  Button,
  Container,
  Text,
  Flex,
  Card,
  Box,
  Modal,
  Code,
} from "@mantine/core";
import { useState } from "react";
import TasksDropdown from "@/components/admin/tasks_dropdown";
import SelectTimer from "@/components/admin/select_timer";
import Preview from "@/components/preview";
import { useDisclosure } from "@mantine/hooks";

interface Message {
  event: string;
  code: { code: string; userId: string };
  remainingTime: number;
}

export default function AdminPage() {
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [remainingTime, setRemainingTime] = useState(0);
  const { mutate } = useSetActiveChallenge();

  const [opened, { open, close }] = useDisclosure(false);
  const [currentSourceCode, setCurrentSourceCode] = useState("");

  useSocket((message) => {
    try {
      const msg = JSON.parse(message.data) as Message;
      if (msg.event === "timer:status") {
        console.log("remaining time", msg.remainingTime);
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
          <div className="flex flex-rows">
            <Button
              onClick={() => {
                mutate({ id: 1, duration: 2 });
              }}
              w={42}
              h={42}
              radius="md"
              mx={10}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ➤
            </Button>
            <TasksDropdown />
            <SelectTimer />
          </div>

          <Text
            size="32px"
            fw={900}
            variant="gradient"
            gradient={{ from: "blue", to: "cyan", deg: 140 }}
          >
            ADMIN PANEL
          </Text>

          <div className="flex flex-rows">
            <Text className="text-xl mr-4">Current Task: [Something]</Text>
            <Text className="text-xl">Time left: {remainingTime}</Text>
          </div>
        </Flex>
      </Box>
      <Flex align="center" justify="center" wrap="wrap">
        {Object.entries(codes).map(([userId, code]) => (
          <Card key={`${userId}-code`}>
            <Text fw={500}>{userId}</Text>
            <Button
              onClick={() => {
                setCurrentSourceCode(userId);
                open();
              }}
              className="absolute top-2 right-4 h-[30px] w-[120px]"
            >
              Source
            </Button>
            <Modal
              size="xl"
              opened={opened}
              onClose={close}
              title={`Source code: ${currentSourceCode}`}
            >
              <Code block> {code}</Code>
            </Modal>

            <Preview value={code} />
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
