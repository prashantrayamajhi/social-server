const router = require("express").Router();
const controller = require("../controllers/user.controller");
const upload = require("./../middleware/multer");
const passport = require("passport");

router.get("/search/:term", controller.searchUsers);

router.patch(
  "/profile/:id",
  passport.authenticate("jwt", { session: false }),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  controller.updateUser
);

router.delete(
  "/profile/:id",
  passport.authenticate("jwt", { session: false }),
  controller.deleteUser
);

module.exports = router;
