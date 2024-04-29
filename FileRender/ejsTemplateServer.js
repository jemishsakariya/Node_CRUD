const http = require("http");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.url == "/favicon.ico") return;

  const file = path.join(
    __dirname,
    "views",
    req.url == "/" ? "index.ejs" : req.url
  );
  // console.log(file);

  /*
    ejs.renderFile(file, { name: "jemish" }, (err, content) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.write({ message: "Error in reading File" });
        res.end();
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      }
    });
  */

  const names = ["Adam", "Alex", "Aaron", "Ben", "David", "Edward", "John"];
  fs.readFile(file, "utf8", (err, content) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.write({ message: "Error in reading File" });
      res.end();
    } else {
      const ejsContent = ejs.render(content, { isTrue: true, names });
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(ejsContent);
    }
  });
});

server.listen(PORT, () => {
  console.log(`server is listening on http://127.0.0.1:${PORT}`);
});
