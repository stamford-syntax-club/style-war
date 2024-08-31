import ws from "k6/ws";
import { check } from "k6";

const token =
  "eyJhbGciOiJIUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsInR5cCI6IkpXVCJ9.eyJhcHBfbWV0YWRhdGEiOnt9LCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiYXpwIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiZW1haWwiOm51bGwsImV4cCI6MTcyNDc4NjE0NSwiaWF0IjoxNzI0NzgwMTQ1LCJpc3MiOiJodHRwczovL2tub3duLWNyYW5lLTE2LmNsZXJrLmFjY291bnRzLmRldiIsImp0aSI6ImFmNDdhY2Q4MzBiY2E5NDI3NmM4IiwibmJmIjoxNzI0NzgwMTQwLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsInN1YiI6InVzZXJfMmlraDF1RFpiRHJEcWUwN3pEMGVMRk8zcnhOIiwidXNlcl9tZXRhZGF0YSI6e319.Srcu4CRrvVWRKo64Z4IA2XlFuxHgw7MPaqzeRdq8P4A";

export default function () {
  const url = `ws://localhost:8080/ws/competition?token=${token}`;
  const params = { tags: { my_tag: "hello" } };

  const res = ws.connect(url, params, function (socket) {
    socket.on("open", () => console.log("connected"));
    socket.on("close", () => console.log("disconnected"));

    socket.setInterval(function () {
      console.log("sending code update");
      const message = JSON.stringify({
        event: "code:edit",
        code: {
          code: "doaijdoawidjoadjoiadjaodjo",
          challengeId: 1,
        },
      });
      socket.send(message);
    }, 1000);
  });

  check(res, { "status is 101": (r) => r && r.status === 101 });
}
