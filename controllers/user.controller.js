const Users = require("./../models/User.model");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("./../utils/cloudinary");
const fs = require("fs");
const User = require("./../models/User.model");
const bcrypt = require("bcryptjs");
const moment = require("moment");

exports.getUsers = async (req, res) => {
  try {
    const users = await Users.find()
      .select([
        "name",
        "username",
        "image",
        "bio",
        "address",
        "github",
        "linkedin",
        "instagram",
        "youtube",
        "website",
        "facebook",
        "image",
        "followers",
        "following",
      ])
      .populate("followers", "name image")
      .populate("following", "name image");
    const userCount = await Users.find().countDocuments();
    const data = { users, userCount };
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.getProfile = async (req, res) => {
  let { id } = req.params;
  try {
    let user = await Users.findById(id).populate({
      path: "posts",
      select: "-messages -password -notification -isActivated -comments -email",
      populate: {
        path: "user",
        select: "name image gender",
      },
    });
    if (!user) return res.status(404).send({ err: "Profile not found" });
    return res.status(200).json({ data: user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};

exports.searchUsers = async (req, res) => {
  const { term } = req.params;
  try {
    const users = await Users.find({
      $or: [{ name: term }, { username: term }],
    })
      .select(["name", "username", "image", "followers", "following"])
      .populate("followers", "name image")
      .populate("following", "name image");
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

exports.updateGeneralSettings = async (req, res) => {
  const id = String(req.params.id);
  if (id !== String(req.user._id)) {
    return res.status(401).send({ msg: "Not authorized" });
  }
  let { name, address, gender, dateOfBirth } = req.body;
  if (!name) return res.status(400).send({ err: "Name cannot be empty" });
  if (!address) return res.status(400).send({ err: "Address cannot be empty" });
  if (!gender) return res.status(400).send({ err: "Gender cannot be empty" });
  if (dateOfBirth) {
    dateOfBirth = moment(dateOfBirth).format("MM-DD-YYYY");
  }
  try {
    const data = await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        name,
        address,
        gender,
        dateOfBirth,
      }
    );
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.updateProfileSettings = async (req, res) => {
  const id = String(req.params.id);
  if (id !== String(req.user._id)) {
    return res.status(401).send({ msg: "Not authorized" });
  }
  let { bio, website, github, instagram, linkedin, facebook, youtube } =
    req.body;

  if (bio) {
    if (bio.trim().length > 80) {
      return res
        .status(400)
        .send({ err: "Bio cannot have more the 80 letters" });
    }
  }
  try {
    const data = await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        bio,
        website,
        github,
        instagram,
        linkedin,
        facebook,
        youtube,
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
