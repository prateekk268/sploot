const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// -----------------------------------------------------------------------------

function validAge(string) {
  const num = parseInt(string);
  if (num > 0) {
    return true;
  } else {
    return false;
  }
}

// ----------------------------------------------------------------------------------

const signup = async (req, res) => {
  try {
    const { name, email, password, age } = req.body;
    // validation
    if (!name && !email && !password && !age) {
      return res.status(400).send({
        statusCode: 400,
        error: "Please provide all the required fields",
      });
    }

    if (name.trim().length === 0) {
      return res
        .status(400)
        .send({ statusCode: 400, error: "Please provide a name" });
    }
    if (email.trim().length === 0) {
      return res
        .status(400)
        .send({ statusCode: 400, error: "Please provide an email" });
    }
    if (password.trim().length === 0) {
      return res
        .status(400)
        .send({ statusCode: 400, error: "Please provide a password" });
    }
    if (!validAge(age)) {
      return res
        .status(400)
        .send({ statusCode: 400, error: "Please provide valid age" });
    }

    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
      return res
        .status(400)
        .send({ statusCode: 400, error: "Enter a valid email" });
    }

    // No Duplicate
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res
        .status(409)
        .json({ statusCode: 400, error: "Email already exists" });

    // hashed password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      age,
    });

    return res.status(201).send({
      statusCode: 201,
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validation
    if (!email && !password) {
      return res.status(400).send({
        statusCode: 400,
        error: "Please provide all the required fields",
      });
    }

    if (email.trim().length === 0) {
      return res
        .status(400)
        .send({ statusCode: 400, error: "Please provide an email" });
    }
    if (password.trim().length === 0) {
      return res
        .status(400)
        .send({ statusCode: 400, error: "Please provide a password" });
    }

    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
      return res
        .status(400)
        .send({ statusCode: 400, error: "Enter a valid email" });
    }
    //   check if the user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .send({ statusCode: 401, error: "This email is not registerd" });
    }
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .send({ statusCode: 401, error: "Your password is incorrect" });
    }
    // Genrate the Jwt token
    const token = jwt.sign({ userId: user._id }, "sploot_assignment", {
      expiresIn: "1h",
    });

    res.header("Authorization", "Bearer : " + token);
    return res.status(200).send({
      statusCode: 200,
      data: token,
      message: "Login Successful",
    });
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
};

const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, age } = req.body;
        
        if(req.user.userId !== userId){
            return res.status(401).json({ statusCode: 401, error: "You are not authorized to update this user" });
        }
        const user = await userModel.findById(userId);
        if(name) {
            if (name.trim().length === 0) {
                return res
                  .status(400)
                  .send({ statusCode: 400, error: "Please provide a name" });
            }
            user.name = name;
        }
        if(age) {
            if (age.trim().length === 0) {
                return res
                .status(400)
                .send({ statusCode: 400, error: "Please provide a age" });
            }
            user.age = age;
        }
        const updatedUser = await user.save();
        return res.status(200).json({ statusCode: 200, data: updatedUser });
    } catch (error) {
        return res.status(500).json({ statusCode: 500, error: error.message });
    }
}

module.exports = { signup, login, updateUser };
