const http = require("http");

const PORT = 3000;

const server = http.createServer(function (req, res) {
  const reqURL = req.url;
  const reqMethod = req.method;

  if (reqMethod === "GET" && reqURL.match(/\/api\/v1\/user\/([0-9]+)/)) {
    const id = reqURL.split("/")[4];

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "id is: " + id }));
    res.end();
  } 
});

server.listen(PORT, function () {
  console.log(`Server is listening on http://127.0.0.1:${PORT}`);
});
