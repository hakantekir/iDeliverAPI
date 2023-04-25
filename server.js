const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./utils/openapi.yaml');

const port = process.env.PORT || 8000;
const app = express();
upload = multer({ dest: 'uploads/' });
app.use(express.json());
app.use(upload.single('image'));
dotenv.config();

const authRouter = require("./routes/auth");
const categoryRouter = require("./routes/category");

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/categories', categoryRouter);

app.use((err, req, res, next) => {
    const error = {
        statusCode: err.statusCode || 500,
        reason: err.reason || 'Server error',
        message: err.message || 'Something went wrong'
    }
    console.log(error);
    res.status(error.statusCode).json(error);
});

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
