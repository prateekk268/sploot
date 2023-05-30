const userModel = require("../models/userModel");
const articleModel = require("../models/articleModel");
const mongoose = require("mongoose");

// ----------------------------------------------------------------

const isValidObjectId = function (value) {
  return mongoose.Types.ObjectId.isValid(value);
};

// ----------------------------------------------------------------

const createArticle = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, description } = req.body;
    // validation
    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ statusCode: 400, error: "Enter a valid userId" });
    }
    if (!title && !description) {
      return res.status(400).send({
        statusCode: 400,
        error: "Please provide all the required fields",
      });
    }
    if (title.trim().length === 0) {
      return res
        .status(400)
        .send({ statusCode: 400, error: "Enter a valid title" });
    }
    if (description.trim().length === 0) {
      return res.status(400).send({
        statusCode: 400,
        error: "Enter a valid description",
      });
    }
    //   valid user
    const userCheck = await userModel.findById(userId);
    if (!userCheck) {
      return res
        .status(400)
        .send({ statusCode: 400, error: "This userId doesnot exist" });
    }

    if (req.user.userId != userId) {
      return res.status(400).send({
        statusCode: 400,
        error: "You are not authorized to create this article",
      });
    }
    // unique title
    const titleCheck = await articleModel.findOne({ title });
    if (titleCheck) {
      return res.status(400).send({
        statusCode: 400,
        error: "This title is already taken",
      });
    }
    //   Create article
    const newArticle = await articleModel.create({
      title,
      description,
      author: userId,
    });
    return res.status(201).send({
      statusCode: 201,
      data: newArticle,
      message: "Article created successfully",
    });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
};

const getallArticle = async (req, res) => {
  try {
    const article = await articleModel.find().populate("author", "name age");
    return res.status(200).send({
      statusCode: 200,
      data: article,
      message: "Articles fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
};

module.exports = { createArticle, getallArticle };
