const jwt = require('jsonwebtoken');
const error = require('../utils/error');

function generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2w' });
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

function verifyTokenMiddleware(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(400).json(error.missingCredentialsError);
    }
    const token = authorization.split(' ')[1];
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
    verifyTokenMiddleware
}