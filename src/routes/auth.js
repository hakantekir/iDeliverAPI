const router = require("express").Router();
const { login, register, verifyToken, me, forgetPassword, resetCodeCheck, resetPassword } = require("../controllers/auth_controller");
const AuthValidation = require("../middleware/validation/auth_validation");

//Validation eklenecek.
router.post("/login", AuthValidation.login, login);
router.post("/register", AuthValidation.register, register);
// router.post("/verify", verifyToken);
router.post("/forget-password", forgetPassword);
router.post("/reset-code-check", resetCodeCheck);
router.post("/reset-password", resetPassword);
router.get("/me", me);

module.exports = router;
