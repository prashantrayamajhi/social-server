const router = require("express").Router();
const controller = require("./../controllers/auth.controller");

router.post("/login", controller.login);

router.post("/signup", controller.signup);

router.post("/verify", controller.postVerificationToken);

router.post("/resend", controller.resendVerificationToken);

module.exports = router;
