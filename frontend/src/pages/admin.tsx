import { Container, Text } from "@mantine/core";

const teams = new Array(6).fill("Team");

function AdminPage() {
  return (
    <Container fluid>
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
          <div className="text-center text-2xl">99:99</div>
        </div>
      </div>
    </Container>
  );
}

export default AdminPage;
