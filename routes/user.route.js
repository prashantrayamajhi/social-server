const router = require("express").Router();
const controller = require("../controllers/user.controller");
const upload = require("./../middleware/multer");
const passport = require("passport");

router.get("/search", controller.getUsers);

router.get("/profile/:id", controller.getProfile);

router.get("/search/:term", controller.searchUsers);

router.patch(
  "/profile/picture/:id",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  controller.updateProfilePicture
);

router.patch(
  "/profile/general/:id",
  passport.authenticate("jwt", { session: false }),
  controller.updateGeneralSettings
);

router.patch(
  "/profile/profile/:id",
  passport.authenticate("jwt", { session: false }),
  controller.updateProfileSettings
);

router.delete(
  "/profile/:id",
  passport.authenticate("jwt", { session: false }),
  controller.deleteUser
);

router.post(
  "/follow",
  passport.authenticate("jwt", { session: false }),
  controller.followUser
);

router.post(
  "/unfollow",
  passport.authenticate("jwt", { session: false }),
  controller.unfollowUser
);

module.exports = router;
