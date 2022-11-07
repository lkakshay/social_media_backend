const express = require("express");
const connect = require("./src/configs/db/db");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const postRoute = require("./src/routes/postRoute");
const profileRoute = require("./src/routes/profileRoute");

app.use(express.json());

var allowedOrigins = ["http://localhost:3000", "http://192.168.0.117:3000"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
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

//test
app.get("/", async (req, res) => {
  return res.send("server running");
});

app.use("/api/post", tokenValidator, postRoute);
app.use("/api/profile", tokenValidator, profileRoute);


app.listen(port, "192.168.0.117", async () => {
  try {
    await connect();
    console.log(`server started at ${port}`);
  } catch (e) {
    console.log(e.message);
  }
});
