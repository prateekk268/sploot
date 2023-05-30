const express = require("express");
const route = express.Router();
const { signup, login, updateUser } = require("../controllers/userController");
const { authentication } = require("../middleware/authentication");
const { createArticle, getallArticle } = require("../controllers/articleController");

route.get("/", (req, res) => {
  res.send("hello testing");
});

route.post("/api/signup", signup);
route.post("/api/login", login);
route.post('/api/users/:userId/articles', authentication, createArticle);
route.get("/api/articles", authentication, getallArticle);
route.put('/api/users/:userId', authentication, updateUser);

module.exports = route;