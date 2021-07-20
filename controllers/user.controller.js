const Users = require("./../models/User.model");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("./../utils/cloudinary");
const fs = require("fs");
const User = require("./../models/User.model");
const bcrypt = require("bcryptjs");

exports.getUsers = async (req, res) => {
  try {
    const users = await Users.find().select([
      "name",
      "username",
      "image",
      "github",
      "linkedin",
      "instagram",
      "youtube",
      "website",
      "facebook",
      "image",
    ]);
    const userCount = await Users.find().countDocuments();
    const data = { users, userCount };
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

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

  let {
    name,
    password,
    github,
    linkedin,
    instagram,
    youtube,
    website,
    facebook,
  } = req.body;

  if (name) name = name.trim();
  if (password) password = password.trim();

  password = bcrypt.hashSync(password, 10);

  if (!name) return res.status(400).send({ err: "Name cannot be empty" });
  if (!password)
    return res.status(400).send({ err: "Password cannot be empty" });

  let imageUrl;
  let imagePublicId;
  try {
    const user = await Users.findOne({ _id: id });
    if (!user) return res.status(404).send({ err: "User not found" });
    if (String(user._id) !== String(req.user._id))
      return res.status(401).send({ err: "Cannot update profile" });
    if (req.file) {
      const image = await uploadToCloudinary("uploads/" + req.file.filename);
      const path = req.file.path;
      fs.unlinkSync(path);
      if (!image.secure_url) {
        return res.status(500).send({ err: "Cannot upload to cloudinary" });
      }
      imageUrl = image.secure_url;
      imagePublicId = image.public_id;
    }

    if (req.body.image) {
      imageUrl = req.body.image;
    }

    const data = await User.findOneAndUpdate(
      { _id: user._id },
      {
        name,
        password,
        github,
        linkedin,
        instagram,
        youtube,
        website,
        facebook,
        image: imageUrl,
        imagePublicId,
      }
    );
    return res.status(200).json({ data });
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

exports.deleteProfilePicture = async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};

exports.followUser = async (req, res) => {
  const { userId } = req.body;
  const id = String(req.user.id);
  try {
    const user = await User.findById(userId);
    const currentUser = await User.findById(id);
    if (!user) return res.status(404).send({ err: "User not found" });
    if (userId === id)
      return res.status(400).send({ err: "Cannot follow yourself" });
    if (user.followers.includes(id))
      return res.status(400).send({ err: "Already following the user" });
    await currentUser.updateOne({
      $push: {
        following: userId,
      },
    });
    await user.updateOne({
      $push: {
        followers: id,
      },
    });
    res.status(200).send({ msg: "User followed" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};

exports.unfollowUser = async (req, res) => {
  const { userId } = req.body;
  const id = String(req.user.id);
  try {
    const user = await User.findById(userId);
    const currentUser = await User.findById(id);
    if (!user) return res.status(404).send({ err: "User not found" });
    if (userId === id)
      return res.status(400).send({ err: "Cannot unfollow yourself" });
    if (!user.followers.includes(id))
      return res.status(400).send({ err: "Already unfollowing the user" });
    await currentUser.updateOne({
      $pull: {
        following: userId,
      },
    });
    await user.updateOne({
      $pull: {
        followers: id,
      },
    });
    res.status(200).send({ msg: "User unfollowed" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};
