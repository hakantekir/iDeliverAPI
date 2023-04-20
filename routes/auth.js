const express = require("express");
const router = express.Router();
require("dotenv");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("../utils/jwt");
const error = require("../utils/error");
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json(error.missingCredentialsError);
  }
  const user = new User({
    name,
    email,
    password,
  });
  try {
    const savedUser = await user.save();
    const token = jwt.generateToken({ id: savedUser._id, email: savedUser.email });
    res.status(201).json({ token: token });
  } catch (err) {
    if (err.errors && err.errors.password && err.errors.password.kind === "minlength") {
      return res.status(400).json(error.passwordTooShortError);
    } else if (err.code === 11000) {
      return res.status(400).json(error.emailExistsError);
    }
    res.status(500).json(error.serverError);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json(error.missingCredentialsError);
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json(error.invalidCredentialsError);
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json(error.invalidCredentialsError);
    }
    const token = jwt.generateToken({ id: user._id, email: user.email });
    res.status(200).json({ token: token });
  } catch (err) {
    res.status(500).json(error.serverError);
  }
});

router.post("/verify", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json(error.missingCredentialsError);
  }
  try {
    const payload = jwt.verifyToken(token);
    const user = await User.findOne({ id: payload.id, email: payload.email });
    if (!user) {
      return res.status(401).json(error.invalidCredentialsError);
    }
    res.status(200).json({ name: user.name, email: user.email });
  } catch (err) {
    res.status(401).json(error.invalidCredentialsError);
  }
});

module.exports = router;
