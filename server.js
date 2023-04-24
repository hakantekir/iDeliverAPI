const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./utils/openapi.yaml');

dotenv.config();

const port = process.env.PORT || 8000;
app.use(express.json());

const authRouter = require("./routes/auth");

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1/auth", authRouter);

mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to DB");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
