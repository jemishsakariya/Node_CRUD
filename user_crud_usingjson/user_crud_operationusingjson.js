const http = require("http");
const fs = require("fs");
const crypto = require("crypto");
const querystring = require("querystring");

const PORT = 3000;

function writeData(data) {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync("./userData.json", stringifyData);
}
function readData() {
  const jsonData = fs.readFileSync("./userData.json");
  return JSON.parse(jsonData);
}

writeData([]);

const server = http.createServer(function (req, res) {
  const reqURL = req.url;
  const reqMethod = req.method;

  if (reqMethod === "POST" && reqURL === "/api/v1/user") {
    createUser(req, res);
  } else if (reqMethod === "GET" && reqURL === "/api/v1/user") {
    getAllUsers(req, res);
  } else if (reqMethod === "PATCH" && reqURL === "/api/v1/user") {
    updateUser(req, res);
  } else if (reqMethod === "DELETE" && reqURL === "/api/v1/user") {
    deleteUser(req, res);
  } else if (reqMethod === "POST" && reqURL === "/api/v1/userprofile") {
    storeUserProfileImg(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "Request url is Invalid!!" }));
    res.end();
  }
});

function createUser(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { email, password } = JSON.parse(body);
    const userData = readData();

    if (!email || !password) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "Email or Password not Found!!" }));
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{8,}$/;

      if (emailRegex.test(email) && passRegex.test(password)) {
        const existingUser = userData.find((user) => user.email === email);
        if (existingUser) {
          res.writeHead(409, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ message: "User already exists" }));
        } else {
          const salt = crypto.randomBytes(16).toString("hex");
          const encryptPassword = crypto
            .pbkdf2Sync(password, salt, 1000, 64, "sha512")
            .toString("hex");

          userData.push({ email, password: encryptPassword });
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ message: "user created Successfully" }));
        }
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "Email or Password is Invalid" }));
      }
    }

    writeData(userData);
    res.end();
  });

  req.on("error", (err) => {
    console.log(err);
  });
}

function getAllUsers(req, res) {
  const userData = readData();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify({ message: "GET Succesfull", userData }));
  res.end();
}

function updateUser(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { oldEmail, newEmail } = JSON.parse(body);
    const userData = readData();

    if (!oldEmail || !newEmail) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "Please fill Empty fields!!" }));
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (emailRegex.test(newEmail)) {
        const existingUser = userData.findIndex(
          (user) => user.email === oldEmail
        );
        if (existingUser != -1) {
          userData[existingUser].email = newEmail;
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ message: "user updated Successfully" }));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ message: "user not found" }));
        }
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "newEmail is Invalid" }));
      }
    }

    writeData(userData);
    res.end();
  });

  req.on("error", (err) => {
    console.log(err);
  });
}

function deleteUser(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { email } = JSON.parse(body);
    const userData = readData();

    if (!email) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "Please fill Empty fields!!" }));
    } else {
      const findUserIdx = userData.findIndex((user) => user.email === email);
      if (findUserIdx != -1) {
        userData.splice(findUserIdx, 1);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "user deleted Successfully" }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "user not found" }));
      }
    }

    writeData(userData);
    res.end();
  });

  req.on("error", (err) => {
    console.log(err);
  });
}

function storeUserProfileImg(req, res) {
  let body = [];

  req.on("data", (data) => {
    body.push(data);
  });

  req.on("end", () => {
    body = Buffer.concat(body).toString("binary"); // converting body to binary string and join body array

    const note = querystring.parse(body, "\r\n", ":"); // get all binary data
    // console.log(note);

    let fileName;

    // making sure than an image was submitted in postman form-data
    if (note["Content-Type"].indexOf("image") !== -1) {
      const fileInfo = note["Content-Disposition"].split("; ");
      // console.log(fileInfo);

      for (const value of fileInfo) {
        if (value.indexOf("filename=") !== -1) {
          fileName = value.substring(10, value.length - 1);

          if (fileName.indexOf("\\") !== -1) {
            fileName = fileName.substring(fileName.lastIndexOf("\\") + 1);
          }
          // console.log(fileName);
        }
      }

      const contentType = note["Content-Type"].substring(1);
      // console.log(contentType);

      //Get the location of the start of the binary file, which happens to be where contentType ends
      const upperBoundary = body.indexOf(contentType) + contentType.length;
      // console.log(upperBoundary);

      const binaryData = body
        .substring(upperBoundary)
        .replace(/^\s\s*/, "")
        .replace(/\s\s*$/, "");

      // console.log(binaryData);

      fs.writeFileSync(fileName, binaryData, "binary");

      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "Image Succesfully Stored" }));
      res.end();
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "Image Store Failed" }));
      res.end();
    }
  });

  req.on("error", (err) => {
    console.log(err);
  });
}

server.listen(PORT, function () {
  console.log(`Server is listening on http://127.0.0.1:${PORT}`);
});
