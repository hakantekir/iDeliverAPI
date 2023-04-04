const express = require('express');
const router = express.Router();
require('dotenv');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('../utils/jwt');

const createError = (statusCode, reason, message) => {
    return { statusCode, reason, message };
};

const missingCredentialsError = createError(101, 'Missing credentials', 'Please provide a name, email, and password');
const invalidCredentialsError = createError(102, 'Invalid credentials', 'The email or password you entered is incorrect');
const emailExistsError = createError(103, 'Email already exists', 'This email address is already in use');
const passwordTooShortError = createError(104, 'Password too short', 'Password must be at least 8 characters');
const serverError = createError(500, 'Server error', 'Something went wrong');

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json(missingCredentialsError);
    }
    const user = new User({
        name,
        email,
        password
    });
    try {
        const savedUser = await user.save();
        const token = jwt.generateToken({ id: savedUser._id, email: savedUser.email });
        res.status(201).json({ token: token });
    } catch (err) {
        if ( err.errors && err.errors.password && err.errors.password.kind === 'minlength') {
            return res.status(400).json(passwordTooShortError);
        } else if (err.code === 11000) {
            return res.status(400).json(emailExistsError);
        }
        res.status(500).json(serverError);
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json(missingCredentialsError);
    }
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(401).json(invalidCredentialsError);
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) {
            return res.status(401).json(invalidCredentialsError);
        }
        const token = jwt.generateToken({ id: user._id, email: user.email });
        res.status(200).json({ token: token });
    } catch (err) {
        res.status(500).json(serverError);
    }
});

router.post('/verify', async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json(missingCredentialsError);
    }
    try {
        const payload = jwt.verifyToken(token);
        const user = await User.findOne({ id: payload.id, email: payload.email });
        if (!user) {
            return res.status(401).json(invalidCredentialsError);
        }
        res.status(200).json({ name: user.name, email: user.email });
    } catch (err) {
        res.status(401).json(invalidCredentialsError);
    }
});

module.exports = router;