const jwt = require("jsonwebtoken");
const error = require("./error");
const secret = process.env.JWT_SECRET || "secret";

function generateToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: "2w" });
}

function verifyToken(token) {
  return jwt.verify(token, secret);
}

function verifyTokenMiddleware(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).json(error.missingCredentialsError);
  }
  const token = authorization.split(" ")[1];
  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    res.status(401).json(error.invalidTokenError);
  }
}

module.exports = {
  generateToken,
  verifyToken,
  verifyTokenMiddleware,
};
