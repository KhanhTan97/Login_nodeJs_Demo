const { name } = require("ejs");
const fs = require("fs");
const https = require("https");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const app = express();
const port = 3001;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extends: true }));

// Sessions
const sessions = {};

// Fake DB( PostGres )
const db = {
  users: [
    {
      id: 1,
      email: "freikishou@gmail.com",
      password: "freikishou123",
      name: "Frei Kishou",
    },
  ],
  posts: [
    {
      id: 1,
      title: "title 1",
      description: "description 1",
    },
    {
      id: 3,
      title: "title 3",
      description: "description 3",
    },
    {
      id: 3,
      title: "title 3",
      description: "description 3",
    },
  ],
};

// [GET] /api/posts
app.get("/api/posts", (req, res) => {
  res.json(db.posts);
});

// [POST] /api/auth/login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(
    (user) => user.email === email && user.password === password
  );
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const sessionId = Date.now().toString();
  sessions[sessionId] = { sub: user.id };

  res
    .setHeader(
      "Set-Cookie",
      `sessionId=${sessionId}; httpOnly; max-age=3600; samesite=none; secure`
    )
    .json(user);
});

// [GET] /api/auth/me
app.get("/api/auth/me", (req, res) => {
  const session = sessions[req.cookies.sessionId];
  if (!session) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const user = db.users.find((user) => user.id === session.sub);
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  res.json({ user });
});

https
  .createServer(
    {
      key: fs.readFileSync("freikishoucookie.com+2-key.pem"),
      cert: fs.readFileSync("freikishoucookie.com+2.pem"),
    },
    app
  )
  .listen(port, () => {
    console.log(`Demo app is running on port ${port}`);
  });
