const router = require("express").Router();
const { login, register, verifyToken } = require("../controllers/auth_controller");

//Validation eklenecek.
router.post("/login", login);
router.post("/register", register);
router.post("/verify", verifyToken);

module.exports = router;
