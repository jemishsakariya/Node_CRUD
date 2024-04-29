const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {
  // const parsedUrl = url.parse(req.url);

  // let path = parsedUrl.path.replace(/^\/+|\/+$/g, "");
  // console.log(path);

  // if (path == "") {
  //   path = "index.html";
  // } else if (path == "favicon.ico") return;

  // let file = __dirname + "/public/" + path;

  if (req.url == "/favicon.ico") return;

  const file = path.join(
    __dirname,
    "public",
    req.url == "/" ? "index.html" : req.url
  );

  const extname = path.extname(file);
  let contentType = "text/html";
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
  }

  fs.readFile(file, (err, content) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.write({ message: "Error in reading File" });
      res.end();
    } else {
      res.writeHead(200, { "Content-Type": contentType });

      // const fileContent = content
      //   .toString()
      //   .replace("##text##", "Hello Everyone, How are you!");

      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`server is listening on http://127.0.0.1:${PORT}`);
});
