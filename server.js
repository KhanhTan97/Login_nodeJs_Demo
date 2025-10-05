const { name } = require("ejs");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const app = express();
const port = 3001;

app.use(cors());
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

// Listen port
app.listen(port, () => {
  console.log(`Demo app is running on port ${port}`);
});
