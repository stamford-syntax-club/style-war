import ws from "k6/ws";
import { check } from "k6";
import { scenario } from "k6/execution";

const tokens = [
  // Chinathai
  "eyJhbGciOiJIUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsInR5cCI6IkpXVCJ9.eyJhcHBfbWV0YWRhdGEiOnt9LCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiYXpwIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiZW1haWwiOm51bGwsImV4cCI6MTcyNTE3NjY1MywiaWF0IjoxNzI1MTcwNjUzLCJpc3MiOiJodHRwczovL2tub3duLWNyYW5lLTE2LmNsZXJrLmFjY291bnRzLmRldiIsImp0aSI6IjI2OTRjYjAwNmQ0YTY0YzQxZmEwIiwibmJmIjoxNzI1MTcwNjQ4LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsInN1YiI6InVzZXJfMmlrYk1QNXhXYnBKVDBTbVlSQ1JhcFVqdkN0IiwidXNlcl9tZXRhZGF0YSI6e319.uOKm9ndSjhk9EdB31AUqMajsYs7isJ_8JkqlGks4JPg",

  // Pumin
  "eyJhbGciOiJIUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsInR5cCI6IkpXVCJ9.eyJhcHBfbWV0YWRhdGEiOnt9LCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiYXpwIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiZW1haWwiOm51bGwsImV4cCI6MTcyNTE3NjU4NSwiaWF0IjoxNzI1MTcwNTg1LCJpc3MiOiJodHRwczovL2tub3duLWNyYW5lLTE2LmNsZXJrLmFjY291bnRzLmRldiIsImp0aSI6ImQzNGJmZDY3MGZhNDZiNzc1N2ZhIiwibmJmIjoxNzI1MTcwNTgwLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsInN1YiI6InVzZXJfMmlraDF1RFpiRHJEcWUwN3pEMGVMRk8zcnhOIiwidXNlcl9tZXRhZGF0YSI6e319.W19s-qAJDfFapX6-CEO79FGSWeas6JtpCKca2C2P-qg",

  // Ana
  "eyJhbGciOiJIUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsInR5cCI6IkpXVCJ9.eyJhcHBfbWV0YWRhdGEiOnt9LCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiYXpwIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiZW1haWwiOm51bGwsImV4cCI6MTcyNTE3NjY5NywiaWF0IjoxNzI1MTcwNjk3LCJpc3MiOiJodHRwczovL2tub3duLWNyYW5lLTE2LmNsZXJrLmFjY291bnRzLmRldiIsImp0aSI6IjI1YmNlYWU0ZGQ1ZjY4MjEyYzRmIiwibmJmIjoxNzI1MTcwNjkyLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsInN1YiI6InVzZXJfMmlrZ3licURyRmlzTlBYS09TQW1DMk5pMVlIIiwidXNlcl9tZXRhZGF0YSI6e319.D-liAqdytYn0PdFbh-Hzl8tlJaK4pCTXBONxZCzbWIs",

  // Basu
  "eyJhbGciOiJIUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsInR5cCI6IkpXVCJ9.eyJhcHBfbWV0YWRhdGEiOnt9LCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiYXpwIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiZW1haWwiOm51bGwsImV4cCI6MTcyNTE3NzI4MywiaWF0IjoxNzI1MTcxMjgzLCJpc3MiOiJodHRwczovL2tub3duLWNyYW5lLTE2LmNsZXJrLmFjY291bnRzLmRldiIsImp0aSI6ImQ4Y2MyY2UzYTA3NDQ3ZTFkOGViIiwibmJmIjoxNzI1MTcxMjc4LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsInN1YiI6InVzZXJfMmlrZ3plMHV2ZVFoTHlMNktXbTVtZEd2ZDViIiwidXNlcl9tZXRhZGF0YSI6e319.RLydG7cdYWdZiHlPKfrGBvY0bjfd2xqzc2F19bNfQUk",

  // Long
  "eyJhbGciOiJIUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsInR5cCI6IkpXVCJ9.eyJhcHBfbWV0YWRhdGEiOnt9LCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiYXpwIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiZW1haWwiOm51bGwsImV4cCI6MTcyNTE3NzMzNSwiaWF0IjoxNzI1MTcxMzM1LCJpc3MiOiJodHRwczovL2tub3duLWNyYW5lLTE2LmNsZXJrLmFjY291bnRzLmRldiIsImp0aSI6ImZhNzBlMTZmNGZiYzVmNWRiMjY0IiwibmJmIjoxNzI1MTcxMzMwLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsInN1YiI6InVzZXJfMmlraDBYb2F1QnlON2NZb0JjVWQwZmV3RVFNIiwidXNlcl9tZXRhZGF0YSI6e319.RlixFFnbH_uSn-wHR6T04GnHExuxi9u0ZSDROueaN-g",
];

const codes = [
  `
  <!DOCTYPE html>
  <html>
  
  <head>
      <title>Table</title>
      <script src="https://cdn.tailwindcss.com"></script>
  </head>
  
  <body>
      <div class="flex flex-row">
          <div>
              <table class="table-auto">
                  <thead class="bg-lime-300">
                      <tr>
                          <th class="px-4 py-2">Course Code</th>
                          <th class="px-4 py-2">Course Name</th>
                          <th class="px-4 py-2">Year</th>
                          <th class="px-4 py-2">
                              <input type="checkbox" checked />
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr class="">
                          <td class="border px-4 py-2">ITE 210</td>
                          <td class="border px-4 py-2">
                              Social and Professional issues in Information Technology
                          </td>
                          <td class="border px-4 py-2">1</td>
                          <td class="border px-4 py-2">
                              <input type="checkbox" />
                          </td>
                      </tr>
                      <tr class="">
                          <td class="border px-4 py-2">ITE 210</td>
                          <td class="border px-4 py-2">
                              Social and Professional issues in Information Technology
                          </td>
                          <td class="border px-4 py-2">1</td>
                          <td class="border px-4 py-2">
                              <input type="checkbox" />
                          </td>
                      </tr>
                      <tr class="">
                          <td class="border px-4 py-2">ITE 210</td>
                          <td class="border px-4 py-2">
                              Social and Professional issues in Information Technology
                          </td>
                          <td class="border px-4 py-2">1</td>
                          <td class="border px-4 py-2">
                              <input type="checkbox" />
                          </td>
                      </tr>
                      <tr class="">
                          <td class="border px-4 py-2">ITE 210</td>
                          <td class="border px-4 py-2">
                              Social and Professional issues in Information Technology
                          </td>
                          <td class="border px-4 py-2">1</td>
                          <td class="border px-4 py-2">
                              <input type="checkbox" />
                          </td>
                      </tr>
                      <tr class="">
                          <td class="border px-4 py-2">ITE 210</td>
                          <td class="border px-4 py-2">
                              Social and Professional issues in Information Technology
                          </td>
                          <td class="border px-4 py-2">1</td>
                          <td class="border px-4 py-2">
                              <input type="checkbox" />
                          </td>
                      </tr>
                      <tr class="">
                          <td class="border px-4 py-2">ITE 210</td>
                          <td class="border px-4 py-2">
                              Social and Professional issues in Information Technology
                          </td>
                          <td class="border px-4 py-2">1</td>
                          <td class="border px-4 py-2">
                              <input type="checkbox" />
                          </td>
                      </tr>
                      <tr class="">
                          <td class="border px-4 py-2">ITE 210</td>
                          <td class="border px-4 py-2">
                              Social and Professional issues in Information Technology
                          </td>
                          <td class="border px-4 py-2">1</td>
                          <td class="border px-4 py-2">
                              <input type="checkbox" />
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
          <div>
              </table>
              <table class="table-auto">
                  <thead class="bg-lime-300">
                      <tr>
                          <th class="px-4 py-2">Course Code</th>
                          <th class="px-4 py-2">Course Name</th>
                          <th class="px-4 py-2">Year</th>
                          <th class="px-4 py-2">
                              <input type="checkbox" checked />
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr class="">
                          <td class="border px-4 py-2">ITE 210</td>
                          <td class="border px-4 py-2">
                              Social and Professional issues in Information Technology
                          </td>
                          <td class="border px-4 py-2">1</td>
                          <td class="border px-4 py-2">
                              <input type="checkbox" />
                          </td>
                      </tr>
                      <tr class="">
                          <td class="border px-4 py-2">ITE 210</td>
                          <td class="border px-4 py-2">
                              Social and Professional issues in Information Technology
                          </td>
                          <td class="border px-4 py-2">1</td>
                          <td class="border px-4 py-2">
                              <input type="checkbox" />
                          </td>
                      </tr>
                      <tr class="">
                          <td class="border px-4 py-2">ITE 210</td>
                          <td class="border px-4 py-2">
                              Social and Professional issues in Information Technology
                          </td>
                          <td class="border px-4 py-2">1</td>
                          <td class="border px-4 py-2">
                              <input type="checkbox" />
                          </td>
                      </tr>
                      <tr class="">
                          <td class="border px-4 py-2">ITE 210</td>
                          <td class="border px-4 py-2">
                              Social and Professional issues in Information Technology
                          </td>
                          <td class="border px-4 py-2">1</td>
                          <td class="border px-4 py-2">
                              <input type="checkbox" />
                          </td>
                      </tr>
                      <tr class="">
                          <td class="border px-4 py-2">ITE 210</td>
                          <td class="border px-4 py-2">
                              Social and Professional issues in Information Technology
                          </td>
                          <td class="border px-4 py-2">1</td>
                          <td class="border px-4 py-2">
                              <input type="checkbox" />
                          </td>
                      </tr>
                      <tr class="">
                          <td class="border px-4 py-2">ITE 210</td>
                          <td class="border px-4 py-2">
                              Social and Professional issues in Information Technology
                          </td>
                          <td class="border px-4 py-2">1</td>
                          <td class="border px-4 py-2">
                              <input type="checkbox" />
                          </td>
                      </tr>
                      <tr class="">
                          <td class="border px-4 py-2">ITE 210</td>
                          <td class="border px-4 py-2">
                              Social and Professional issues in Information Technology
                          </td>
                          <td class="border px-4 py-2">1</td>
                          <td class="border px-4 py-2">
                              <input type="checkbox" />
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
  </body>
  
  </html>
  `,
  `
<!doctype html>
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
    <p> Uncomment the script tags to use bootstrap & tailwind</p>
    <p> Woah chill burh!!!! </p>
  </body>
</html>
`,
  `
  <!DOCTYPE html>
  <html>
  <head>
      <title>Review Card</title>
      <link rel="stylesheet" type="text/css" href="review-card.css">
      <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
      <div class="flex flex-col max-w-96 bg-gradient-to-r from-cyan-500 to-sky-300 max-h-80 m-5 p-5 rounded-md">
         <div class="flex flex-col justify-start border-stone-800 border-b-4">
              <span class="text-white text-3xl">Student</span>
         </div>
         <div class="flex justify-center text-white mb-3">
              <span>IDENITY CARD</span>
         </div>
         <div class="flex justify-between">
          <div class="flex flex-col justify-start text-white">
              <p>Name : Akira Tachinaba</p>
              <p>Age : 18</p>
              <p>Major : Infomation Technology</p>
              <p>Academic Year : 2023</p>
              <div>
                  <img class="max-w-48 max-h-24" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngmart.com%2Ffiles%2F7%2FBarcode-PNG-Photos.png&f=1&nofb=1&ipt=496a993d3d550adb76c521a66a75ac54c5af0796c63cab59dc97944aaa459e1e&ipo=images">
              </div>
          </div>
          <div class="flex flex-col text-white items-center">
              <img class="max-w-24 max-h-32" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fami.animecharactersdatabase.com%2Fuploads%2Fchars%2F42795-299358730.jpg&f=1&nofb=1&ipt=cf6a6e18a3a60f31896000680346a3f6f204ca9585d46f16c035c59d036f899c&ipo=images">
              <span> 1245534 </span>
          </div>
         </div>
      </div>            
  </body>
  </html>
`,
  `
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
    <h1> JDAODJOIWAJOIDWAOIDAWJDAO</h1>
    <p> akopskapodkapdkwpada</p>
  </body>
</html>
`,
  `
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
    <h1> STYLEWARS!!!!! </h1>
    <p> FUIYoahhh</p>
  </body>
</html>
`,
];

// This function will be executed by each VU in parallel
export default function () {
  const token = tokens[scenario.iterationInTest];
  const url = `ws://localhost:8080/ws/competition?token=${token}`;
  // const url = `wss://stylewars-be.stamford.dev/ws/competition?token=${token}`;
  const params = { tags: { my_tag: "hello" } };

  const res = ws.connect(url, params, function (socket) {
    socket.on("open", () => console.log("connected"));
    socket.on("close", () => console.log("disconnected"));

    socket.setInterval(function () {
      const codeIdx = Math.floor(Math.random() * 5);
      console.log("sending code update,"), token;
      const message = JSON.stringify({
        event: "code:edit",
        code: {
          code: codes[codeIdx],
          challengeId: 1,
        },
      });
      socket.send(message);
    }, 2000);
  });

  check(res, { "status is 101": (r) => r && r.status === 101 });
}

// k6 configuration for running multiple VUs in parallel
export const options = {
  scenarios: {
    websocket_test: {
      executor: "per-vu-iterations",
      // vus: tokens.length, // Number of virtual users
      iterations: 1, // Each VU runs the function once
    },
  },
};
