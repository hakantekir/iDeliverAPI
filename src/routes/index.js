const router = require("express").Router();

const auth = require("./auth");
const category = require("./category");

router.use("/auth", auth);
router.use("/categories", category);

module.exports = router;
