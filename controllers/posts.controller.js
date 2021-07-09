const Post = require("./../models/Post.model");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("./../utils/cloudinary");
const fs = require("fs");

exports.getPosts = async (req, res) => {
  let postLimit = 2;
  const page = req.query.page ? req.query.page : 1;
  const skip = (page - 1) * postLimit;
  try {
    const postsCount = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate(
        "user",
        "-password -email -gender -createdAt -updatedAt -notifications -followers -following -notifications -posts -messages -likes -comments"
      )
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

exports.postPost = async (req, res) => {
  let { title, anonymous } = req.body;
  title = title.trim();
  let imageUrl, imagePublicId;
  try {
    if (title.length <= 0 && !req.file) {
      return res.status().send({ err: "Cannot create an empty post" });
    }
    if (req.file) {
      const uploadImage = await uploadToCloudinary(
        "uploads/" + req.file.filename
      );
      const path = req.file.path;
      fs.unlinkSync(path);
      if (!uploadImage.secure_url) {
        return res.status(500).send({ err: "Cannot upload to cloudinary" });
      }
      imageUrl = uploadImage.secure_url;
      imagePublicId = uploadImage.public_id;
    }
    const post = new Post({
      title,
      anonymous,
      user: req.user._id,
      image: imageUrl,
      imagePublicId,
    });
    const data = await post.save();
    return res.status(201).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};

exports.updatePostById = async (req, res) => {
  const postId = req.params.id;
  const userId = String(req.user._id);
  let { title, anonymous } = req.body;
  title = title.trim();
  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) return res.status(404).send({ msg: "Post not found" });
    if (userId !== String(post.user))
      return res.status(401).send({ msg: "Cannot update post" });
    post.title = title;
    post.anonymous = anonymous;
    const data = await post.save();
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
    if (!post) return res.status(404).send({ msg: "Post not found" });
    if (userId !== String(post.user))
      return res.status(401).send({ msg: "Cannot delete post" });
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
