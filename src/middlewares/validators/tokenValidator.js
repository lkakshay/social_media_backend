const jwt = require("jsonwebtoken");
require("dotenv").config();
const key = process.env.JWT_KEY;

module.exports = (req, res, next) => {
 
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, key);
    req.body.user_id = decoded.id;
    return next();
  } catch (error) {
    return res.status(400).send("invalid token");
  }
};
