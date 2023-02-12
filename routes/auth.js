const express = require('express');
const router = express.Router();
require('dotenv');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('../utils/jwt');

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json('Missing credentials');
    }
    const user = new User({
        name,
        email,
        password
    });
    try {
        const savedUser = await user.save();
        const token = jwt.generateToken({ id: savedUser._id, email: savedUser.email });
        res.status(201).json({ token });
    } catch (err) {
        if ( err.errors && err.errors.password && err.errors.password.kind === 'minlength') {
            return res.status(400).json('Password must be at least 8 characters');
        } else if (err.code === 11000) {
            return res.status(400).json('Email already exists');
        }
        res.status(500).json('Internal Server Error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('Missing credentials');
    }
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(401).json('Incorrect email address');
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) {
            return res.status(401).json('Incorrect password');
        }
        const token = jwt.generateToken({ id: user._id, email: user.email });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;