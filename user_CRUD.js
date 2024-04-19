const http = require("http");
const url = require("url");

const PORT = 3000;

const userData = [];

const server = http.createServer(function (req, res) {
  const reqURL = req.url;
  const reqMethod = req.method;
  const parsedUrl = url.parse(req.url, true);

  if (reqMethod === "POST" && reqURL === "/user") {
    createUser(req, res);
  } else if (reqMethod === "GET" && reqURL === "/user") {
    getAllUsers(req, res);
  } else if (
    reqMethod === "GET" &&
    parsedUrl.pathname === "/user" &&
    "email" in parsedUrl.query
  ) {
    getUserByEmail(req, res);
  } else if (
    reqMethod === "GET" &&
    parsedUrl.pathname === "/user" &&
    "search" in parsedUrl.query
  ) {
    searchUser(req, res);
  } else if (reqMethod === "PATCH" && reqURL === "/user") {
    updateUser(req, res);
  } else if (reqMethod === "DELETE" && reqURL === "/user") {
    deleteUser(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "Request is Invalid!!" }));
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
          userData.push({ email, password });
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ message: "user created Successfully" }));
        }
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "Email or Password is Invalid" }));
      }
    }

    res.end();
  });

  req.on("error", (err) => {
    console.log(err);
  });
}

function getAllUsers(req, res) {
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

    res.end();
  });

  req.on("error", (err) => {
    console.log(err);
  });
}

function getUserByEmail(req, res) {
  const queryEmail = url.parse(req.url, true).query.email;

  const findUser = userData.find((eachUser) => eachUser.email == queryEmail);
  if (findUser) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(
      JSON.stringify({ message: "user deleted Successfully", findUser })
    );
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "user not found" }));
  }

  res.end();
}

function searchUser(req, res) {
  const querySearch = url.parse(req.url, true).query.search;

  // const searchedUser = userData.filter((eachUser) =>
  //   eachUser.email.includes(querySearch)
  // );

  const searchedUser = [];
  for (const eachUser of userData) {
    const regexSearch = new RegExp(querySearch + ".");

    if (regexSearch.test(eachUser.email)) {
      searchedUser.push(eachUser);
    }
  }

  if (searchedUser.length > 0) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(
      JSON.stringify({ message: "user search Successfully", searchedUser })
    );
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "user not found" }));
  }

  res.end();
}

server.listen(PORT, function () {
  console.log(`Server is listening on http://127.0.0.1:${PORT}`);
});
