const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const authRouter = require('./routes/auth');

app.use(express.json());
app.use('/api/v1/auth', authRouter)

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
        console.log('Connected to DB');
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});