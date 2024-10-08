import { useSetActiveChallenge } from "@/lib/data-hooks/use-set-challenge";
import {
  Button,
  Container,
  Text,
  Flex,
  Box,
  Select,
  NumberInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useAllChallenge } from "@/lib/data-hooks/use-all-challenge";
import { useChallenge } from "@/lib/data-hooks/use-challenge";
import Challenge from "./challenge";
import CodeCard from "@/components/code-card";
import useWebsocket from "react-use-websocket";
import { useSession } from "@clerk/nextjs";
import { notifications } from "@mantine/notifications";

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
  const { data: activeChallengeData } = useChallenge();

  const [selectedChallenge, setSelectedChallenge] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState<string | number>(2);

  const { session } = useSession();
  const [token, setToken] = useState("");
  const backendURL = new URL(process.env.NEXT_PUBLIC_BACKEND_URL || "");
  useWebsocket(
    `${backendURL.protocol === "http:" ? "ws" : "wss"}://${backendURL.host}/ws/admin?token=${token}`,
    {
      onOpen: () => {
        notifications.show({
          title: "Connection Status",
          message: "Connection to backend is established!",
          color: "green",
        });
      },
      onMessage: (message) => {
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
          console.warn(
            "Failed to parse message:",
            error,
            "Data:",
            message.data,
          );
        }
      },
      shouldReconnect: () => true,
      onClose: () => {
        notifications.show({
          title: "Connection Status",
          message: "Connection lost, attempting to reconnect",
          color: "orange",
        });
      },
    },
  );

  useEffect(() => {
    session
      ?.getToken({ template: "style-wars" })
      .then((token) => setToken(token || ""));
  }, [session]);

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
          <Challenge
            objectives={activeChallengeData?.challenge?.objectives ?? [""]}
            isActive={activeChallengeData?.challenge?.isActive ?? true}
            imageUrl={activeChallengeData?.challenge?.imageUrl ?? ""}
          />
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
            // <Card key={`${userId}-code`}>
            //   <Text fw={500}>{userId}</Text>
            //   <Button
            //     onClick={() => toggleViewMode(userId)}
            //     className="absolute top-2 right-4 h-[30px] w-[120px]"
            //   >
            //     Source
            //   </Button>
            //   {viewModes[userId] === "source" ? (
            //     <Code block w={540} h={735}>
            //       {code}
            //     </Code>
            //   ) : (
            //     <Preview value={code} />
            //   )}
            // </Card>
            <CodeCard userId={userId} code={code} />
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
