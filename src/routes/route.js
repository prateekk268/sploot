const express = require("express");
const route = express.Router();
const { signup, login, updateUser } = require("../controllers/userController");
const { authentication } = require("../middleware/authentication");
const { createArticle, getallArticle } = require("../controllers/articleController");

route.get("/", (req, res) => {
  res.send("hello testing");
});

route.post("/signup", signup);
route.post("/login", login);
route.post('/users/:userId/articles', authentication, createArticle);
route.get("/articles", authentication, getallArticle);
route.put('/users/:userId', authentication, updateUser);

module.exports = route;