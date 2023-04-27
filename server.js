const express = require("express");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./src/utils/openapi.yaml");
const router = require("./src/routes/index");

require("./src/database/db");
require("express-async-errors");

const errorHandlerMiddleware = require("./src/middleware/error_handler");
const rateLimit = require("./src/middleware/request-limit/rate_limit");
dotenv.config();

const port = process.env.PORT || 8000;
const app = express();
app.use(express.json()); //Used to parse JSON bodies
app.use(express.json({ limit: "50mb" })); //Used to parse JSON bodies
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 100000 }));
//upload = multer({ dest: "uploads/" });
//app.use(upload.single("image"));

app.use(errorHandlerMiddleware); //Error Handler Middleware

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); //swagger dosyası. düzenlenecektir.
app.use("/api/v1/", rateLimit);
app.use("/api/v1/", router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
