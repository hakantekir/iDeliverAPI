const router = require("express").Router();
const { login, register, verifyToken } = require("../controllers/auth_controller");
const AuthValidation = require("../middleware/validation/auth_validation");

//Validation eklenecek.
router.post("/login", AuthValidation.login, login);
router.post("/register", AuthValidation.register, register);
router.post("/verify", verifyToken);

module.exports = router;
