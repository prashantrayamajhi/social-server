const router = require("express").Router();
const controller = require("../controllers/posts.controller");
const passport = require("passport");
const upload = require("./../middleware/multer");

router.get("/", controller.getPosts);

router.post(
  "/",
  upload.single("image"),
  passport.authenticate("jwt", { session: false }),
  controller.postPost
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.updatePostById
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.deletePostById
);

module.exports = router;
