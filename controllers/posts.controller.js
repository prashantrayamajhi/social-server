const Post = require("./../models/Post.model");
const User = require("./../models/User.model");

const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("./../utils/cloudinary");
const fs = require("fs");

exports.getPosts = async (req, res) => {
  let postLimit = 10;
  const page = req.query.page ? req.query.page : 1;
  const skip = (page - 1) * postLimit;
  try {
    const postsCount = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate("user", "name image gender")
      .populate("likes", "name image")
      .skip(skip)
      .limit(postLimit)
      .sort({
        createdAt: -1,
      });
    const data = { posts, postsCount };

    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};

exports.getPostsByUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).send({ error: "Posts not found" });
    const data = await Post.find().where({
      user: id,
    });
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};

exports.postPost = async (req, res) => {
  let { title } = req.body;
  if (title) {
    title = title.trim();
    if (title.length > 400) {
      return res.status(400).send({ error: "Title too long" });
    }
  }
  let imageUrl, imagePublicId;
  try {
    const user = await User.findById(req.user._id);
    if (!title && !req.file) {
      return res.status(400).send({ error: "Cannot create an empty post" });
    }
    if (req.file) {
      const uploadImage = await uploadToCloudinary(
        "uploads/" + req.file.filename
      );
      const path = req.file.path;
      fs.unlinkSync(path);
      if (!uploadImage.secure_url) {
        return res.status(500).send({ error: "Cannot upload to cloudinary" });
      }
      imageUrl = uploadImage.secure_url;
      imagePublicId = uploadImage.public_id;
    }
    const post = new Post({
      title,
      user: user._id,
      image: imageUrl,
      imagePublicId,
    });
    let data = await post.save();

    await user.updateOne({
      $push: {
        posts: data._id,
      },
    });

    Post.populate(
      data,
      { path: "user", select: "name image gender" },
      (err, post) => {
        if (err) {
          return res.status(500).send({ err });
        }
        return res.status(201).json({ data: post });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};

exports.updatePostById = async (req, res) => {
  const postId = req.params.id;
  const userId = String(req.user._id);
  let { title } = req.body;
  if (title) {
    title = title.trim();
    if (title.length > 400) {
      return res.status(400).send({ error: "Title too long" });
    }
  }
  try {
    const post = await Post.findOne({ _id: postId });
    if (!post.image && !title) {
      return res.status(400).send({ error: "Cannot create an empty post" });
    }
    if (!post) return res.status(404).send({ msg: "Post not found" });
    if (userId !== String(post.user))
      return res.status(401).send({ error: "Cannot update post" });
    const data = await Post.findByIdAndUpdate(postId, { title }).populate({
      path: "user",
      select: "name image gender",
    });
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};

exports.deletePostById = async (req, res) => {
  const postId = req.params.id;
  const userId = String(req.user._id);
  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) return res.status(404).send({ error: "Post not found" });
    if (userId !== String(post.user))
      return res.status(401).send({ error: "Cannot delete post" });
    if (post.imagePublicId) {
      deleteFromCloudinary(post.imagePublicId);
    }
    await Post.findByIdAndDelete({ _id: postId });
    return res.status(200).send({ msg: "Post deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};

exports.like = async (req, res) => {
  let { postId } = req.params;
  const userId = String(req.user._id);
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).send({ err: "Post not found" });
    // unlike the post if the post is already liked by the user
    if (post.likes.includes(userId)) {
      await post.updateOne({
        $pull: {
          likes: userId,
        },
      });
      return res.status(200).send({ msg: "Post unliked" });
    } else {
      await post.updateOne({
        $push: {
          likes: userId,
        },
      });
      return res.status(200).send({ msg: "Post liked" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};
