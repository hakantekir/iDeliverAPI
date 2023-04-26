const express = require("express");
const path = require("path");
require("express-async-errors");
const multer = require("multer");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./src/utils/openapi.yaml");
const router = require("./src/routes/index");

const errorHandlerMiddleware = require("./src/middleware/error_handler");

const port = process.env.PORT || 8000;
const app = express();
//upload = multer({ dest: "uploads/" });
app.use(express.json()); //Used to parse JSON bodies
app.use(express.json({ limit: "50mb" })); //Used to parse JSON bodies
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 100000 })); //Parse URL-encoded bodies
//app.use(upload.single("image"));
dotenv.config();

app.use(errorHandlerMiddleware); //Error Handler Middleware

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1/", router);

app.use((err, req, res, next) => {
  const error = {
    statusCode: err.statusCode || 500,
    reason: err.reason || "Server error",
    message: err.message || "Something went wrong",
  };
  console.log(error);
  res.status(error.statusCode).json(error);
});

//MONGO DB CONNECTION
mongoose.set("strictQuery", false);
mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to DB");
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
