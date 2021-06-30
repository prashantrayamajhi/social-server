const Post = require("./../models/Post.model");

exports.getPosts = async (req, res) => {
  try {
    const data = await Post.find().populate("user").sort({
      createdAt: -1,
    });
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};

exports.postPost = async (req, res) => {
  const { title, anonymous } = req.body;
  try {
    const post = new Post({ title, anonymous, user: req.user._id });
    const data = await post.save();
    return res.status(201).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};

exports.updatePostById = async (req, res) => {
  try {
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
    await Post.findByIdAndDelete({ _id: postId });
    return res.status(200).send({ msg: "Post deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};
