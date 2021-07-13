const Users = require("./../models/User.model");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("./../utils/cloudinary");
const fs = require("fs");

exports.searchUsers = async (req, res) => {
  const { term } = req.params;
  try {
    const users = await Users.find({
      $or: [{ name: term }, { username: term }],
    }).select(["name", "username", "image"]);
    const userCount = await Users.find({
      $or: [{ name: term }, { username: term }],
    }).countDocuments();
    const data = { users, userCount };
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;

  let imageUrl;
  let coverImageUrl;
  let imagePublicId;
  let coverImagePublicId;

  try {
    const user = await Users.findOne({ _id: id });
    if (!user) return res.status(404).send({ err: "User not found" });
    if (String(user._id) !== String(req.user._id))
      return res.status(401).send({ err: "Cannot update profile" });

    if (req.files.image) {
      const image = await uploadToCloudinary(
        "uploads/" + req.files.image[0].filename
      );
      const path = req.files.image[0].path;
      fs.unlinkSync(path);
      if (!image.secure_url) {
        return res.status(500).send({ err: "Cannot upload to cloudinary" });
      }
      imageUrl = image.secure_url;
      imagePublicId = image.public_id;
    }

    // if (req.files.coverImage) {
    //   const coverImage = await uploadToCloudinary(
    //     "uploads/" + req.files.coverImage[0].filename
    //   );
    //   console.log(coverImage);
    //   const path = req.files.coverImage[0].path;
    //   fs.unlinkSync(path);
    //   if (!coverImage.secure_url) {
    //     return res.status(500).send({ err: "Cannot upload to cloudinary" });
    //   }
    //   coverImageUrl = coverImage.secure_url;
    //   coverImagePublicId = coverImage.public_id;
    // }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findOne({ _id: id });
    if (!user) return res.status(404).send({ err: "User not found" });
    if (String(user._id) !== String(req.user._id))
      return res.status(401).send({ err: "Cannot delete profile" });
    await Users.findByIdAndDelete(user._id);
    return res.status(200).send({ msg: "Account deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};
