const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];

    if (!token) {
      return res
        .status(401)
        .send({ statusCode: 401, error: "Token is required" });
    }

    let token1 = token.split(" ").pop();

    jwt.verify(
      token1,
      "sploot_assignment",
      { ignoreExpiration: true },
      function (err, decoded) {
        if (err)
          return res
            .status(401)
            .send({ statusCode: 401, error: "token invalid" });
        else {
          if (Date.now() > decoded.exp * 1000) {
            return res
              .status(401)
              .send({ statusCode: 401, msg: "Session Expired" });
          }
        }

        req.user = decoded;
        next();
      }
    );
  } catch (error) {
    return res.status(500).json({ statusCode: 500, error: error.message });
  }
};

module.exports = { authentication };