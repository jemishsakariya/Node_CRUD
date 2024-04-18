const http = require("http");

const PORT = 3000;

const userData = {};

const server = http.createServer(function (request, response) {
  const reqURL = request.url;
  const reqMethod = request.method;

  switch (reqMethod) {
    case "POST":
      if (reqURL === "/postdata") {
        postHandler(request, response);
      }
      break;
    case "GET":
      if (reqURL === "/getdata") {
        getHandler(request, response);
      }
      break;
    default:
      console.error("There is error");
      response.end();
  }
});

const postHandler = (request, response) => {
  let body = "";
  request.on("data", (chunk) => {
    body += chunk.toString();
  });
  request.on("end", () => {
    const userbody = JSON.parse(body);
    userData[userbody.email] = userbody.password;
    // console.log(userData);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify({ message: "POST Successful" }));
    response.end();
  });
};

const getHandler = (request, response) => {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.write(JSON.stringify({ message: "GET Succesfull", userData }));
  response.end();
};

server.listen(PORT, function () {
  console.log(`Server is listening on http://127.0.0.1:${PORT}`);
});
