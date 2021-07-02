const router = require("express").Router();
const controller = require("../controllers/user.controller");
const upload = require("./../middleware/multer");

router.get("/search/:term", controller.searchUsers);

router.patch(
  "/profile/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  controller.updateUser
);

router.delete("/profile/:id", controller.deleteUser);

module.exports = router;
