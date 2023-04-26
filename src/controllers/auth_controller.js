require("dotenv");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("../utils/jwt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (user) {
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new APIError("Invalid password", 401);
    }

    const token = jwt.generateToken({ id: user._id, email: user.email }); //payload.
    //res.status(200).json({ token: token });

    return new Response({ token: token }, "Login succesfully.").success(res);
  } else {
    throw new APIError("User not found");
  }
};

const register = async (req, res, next) => {
  const { name, email, phone, password } = req.body;
  const checkUser = await User.findOne({ email: email });
  if (checkUser) {
    throw new APIError("User already exists", 401);
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt); //hash the password
  req.body.password = hashPassword;

  console.log(req.body.password);
  const userSave = new User(req.body);

  await userSave
    .save()
    .then((data) => {
      return new Response(data, "User created successfully").created(res);
    })
    .catch((error) => {
      console.log("error: ", error);
      throw new APIError("User not created.", 401);
    });
};

const verifyToken = async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    throw new APIError("Invalid token", 401);
  }
  try {
    const payload = jwt.verifyToken(token);
    const user = await User.findOne({ id: payload.id, email: payload.email });
    if (!user) {
      throw new APIError("User not found", 404);
    }

    Response.success(res, { name: user.name, email: user.email });
  } catch (err) {
    throw new APIError("Invalid token", 401);
  }
};

module.exports = {
  login,
  register,
  verifyToken,
};
