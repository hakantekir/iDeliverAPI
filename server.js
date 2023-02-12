const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();

dotenv.config();

mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true }, () => {
    console.log('Connected to DB');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});