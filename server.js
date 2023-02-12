const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
app.use(express.json());

const authRouter = require('./routes/auth');

app.use('/api/v1/auth', authRouter)

mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to DB');
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});