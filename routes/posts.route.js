const router = require("express").Router();
const controller = require("../controllers/posts.controller");
const passport = require("passport");
const upload = require("./../middleware/multer");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controller.getPosts
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controller.getPostById
);

router.get(
  "/userPosts/:id",
  passport.authenticate("jwt", { session: false }),
  controller.getPostsByUserId
);

router.get(
  "/like/:postId",
  passport.authenticate("jwt", { session: false }),
  controller.like
);

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

router.post(
  "/comment",
  passport.authenticate("jwt", { session: false }),
  controller.comment
);

module.exports = router;
