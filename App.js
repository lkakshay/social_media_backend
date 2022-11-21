const express = require("express");
const connect = require("./src/configs/db/db");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const origin= process.env.ORIGIN;


const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const postRoute = require("./src/routes/postRoute");
const profileRoute = require("./src/routes/profileRoute");

app.use(express.json());
app.use(
  cors({
    origin
  })
);
app.use(fileUpload());
app.use(cookieParser());

const {
  registerValidator,
  registerValidatorResult,
} = require("./src/middlewares/validators/regesterValidator");
const regesterController = require("./src/controllers/authController/registerController");
const loginController = require("./src/controllers/authController/loginController");
const tokenValidator = require("./src/middlewares/validators/tokenValidator");

//auth routes

app.post(
  "/api/register",
  registerValidator,
  registerValidatorResult,
  regesterController
);
app.post("/api/login", loginController);

//user status

app.get("/api/checkuser",tokenValidator,async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  return res.status(200).send({status:200,token});
});

app.use("/api/post", tokenValidator, postRoute);
app.use("/api/profile", tokenValidator, profileRoute);


app.listen(port, async () => {
  try {
    connect();
    console.log(`server started at ${port}`);
  } catch (e) {
    console.log(e.message);
  }
});
