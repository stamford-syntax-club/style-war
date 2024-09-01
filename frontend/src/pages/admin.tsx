import { useSetActiveChallenge } from "@/lib/data-hooks/use-set-challenge";
import { useSocket } from "@/lib/websocket/ws";
import {
  Button,
  Container,
  Text,
  Flex,
  Card,
  Box,
  Code,
  Select,
  NumberInput,
} from "@mantine/core";
import { useState } from "react";
import SelectTimer from "@/components/admin/select_timer";
import Preview from "@/components/preview";
import { useAllChallenge } from "@/lib/data-hooks/use-all-challenge";

interface Message {
  event: string;
  code: { code: string; userId: string };
  remainingTime: number;
}

export default function AdminPage() {
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [remainingTime, setRemainingTime] = useState(0);
  const { mutate } = useSetActiveChallenge();
  const { data: allChallengeData } = useAllChallenge();

  const [selectedChallenge, setSelectedChallenge] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState<string | number>(2);
  const [viewModes, setViewModes] = useState<
    Record<string, "rendered" | "source">
  >({});

  const toggleViewMode = (userId: string) => {
    setViewModes((prev) => ({
      ...prev,
      [userId]: prev[userId] === "rendered" ? "source" : "rendered",
    }));
  };

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
      <Box className="sticky top-[58px] rounded-2xl h-16 content-center mb-10">
        <Flex
          direction="column"
          justify="center"
          className="w-full"
          align="center"
          mb="md"
        >
          <Text
            size="32px"
            fw={900}
            variant="gradient"
            gradient={{ from: "blue", to: "cyan", deg: 140 }}
          >
            ADMIN PANEL
          </Text>
          <Text className="text-xl">Time left: {remainingTime}</Text>
        </Flex>
        <Flex justify="center" align="end" gap="sm">
          <Flex justify="start" align="end" gap="sm">
            {allChallengeData?.allChallenge && (
              <Select
                label="Select Challange"
                onChange={(value) => {
                  if (value) setSelectedChallenge(parseInt(value));
                }}
                data={
                  allChallengeData.allChallenge.map((challenge) => {
                    return {
                      label:
                        `${challenge?.id?.toString()}${
                          challenge?.isActive ? "-active" : ""
                        }` || "",
                      value: challenge?.id?.toString() || "",
                    };
                  }) || []
                }
              />
            )}
            <NumberInput
              label="Duration (minutes)"
              min={2}
              value={selectedDuration}
              onChange={setSelectedDuration}
            />
            <Button
              onClick={() => {
                let duration = 0;
                if (typeof selectedDuration === "string") {
                  duration = 0;
                }

                if (typeof selectedDuration === "number") {
                  duration = selectedDuration;
                }
                mutate({
                  id: selectedChallenge,
                  duration: duration,
                });
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Start
            </Button>
          </Flex>
        </Flex>
        <Flex align="center" justify="center" wrap="wrap" mt="xl">
          {Object.entries(codes).map(([userId, code]) => (
            <Card key={`${userId}-code`}>
              <Text fw={500}>{userId}</Text>
              <Button
                onClick={() => toggleViewMode(userId)}
                className="absolute top-2 right-4 h-[30px] w-[120px]"
              >
                Source
              </Button>
              {viewModes[userId] === "source" ? (
                <Code block w={540} h={720}>
                  {code}
                </Code>
              ) : (
                <Preview value={code} />
              )}
            </Card>
          ))}
        </Flex>
      </Box>
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
