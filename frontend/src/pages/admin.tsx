import { useSetActiveChallenge } from "@/lib/data-hooks/use-set-challenge";
import { useSocket } from "@/lib/websocket/ws";
import { Button, Container, Text } from "@mantine/core";
import { useEffect, useState, useCallback } from "react";

const teams = new Array(6).fill("Team");

interface Message {
  event: string;
  remainingTime: number;
}

function AdminPage() {
  useSocket((message) => {
    try {
      const msg = JSON.parse(message.data) as Message;
      if (msg.event === "timer:status") {
        console.log("remaning time", msg.remainingTime);
        setRemainingTime(msg.remainingTime);
      }
    } catch (error) {
      console.warn("Failed to parse message:", error, "Data:", message.data);
    }
  }, "admin");

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
      <div className="flex mt-6">
        <div className="w-4/5 flex flex-wrap gap-4">
          {teams.map((team, index) => (
            <div key={index} className="flex justify-center">
              <div className="bg-blue-500 text-white w-[640px] h-[360px] p-5 text-center">
                <p className="font-bold">{team}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="w-1/5 justify-center content-center">
          <div className="text-center text-4xl font-bold p-4">TIMER</div>
          <div className="text-center text-2xl">{remainingTime}</div>
        </div>
      </div>
    </Container>
  );
}

export default AdminPage;
