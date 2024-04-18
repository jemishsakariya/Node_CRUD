const http = require("http");

const PORT = 3000;

const server = http.createServer(function (req, res) {
  const reqURL = req.url;
  const reqMethod = req.method;

  if (reqMethod === "POST" && reqURL === "/calculate") {
    calculate(req, res);
  }
});

function calculate(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const reqBody = JSON.parse(body);
    const a = Number(reqBody.a);
    const b = Number(reqBody.b);
    const operator = reqBody.operator;
    let ans;

    if (operator.length !== 1) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "Invalid Operator" }));
      res.end();
      return;
    }

    if (!(Object.is(a, NaN) || Object.is(b, NaN))) {
      if (operator === "+") {
        ans = Number(a) + Number(b);
      } else if (operator === "-") {
        ans = Number(a) - Number(b);
      } else if (operator === "*") {
        ans = Number(a) * Number(b);
      } else if (operator === "/") {
        ans = Number(a) / Number(b);
      } else if (operator === "%") {
        ans = Number(a) % Number(b);
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: `Answer is ${ans}` }));
      res.end();
    } else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "Invalid Number" }));
      res.end();
    }
  });
}

server.listen(PORT, function () {
  console.log(`Server is listening on http://127.0.0.1:${PORT}`);
});
