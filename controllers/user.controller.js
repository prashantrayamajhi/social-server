const Users = require("./../models/User.model");

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
  try {
    const user = await Users.findOne({ _id: id });
    if (!user) return res.status(404).send({ err: "User not found" });
    if (String(user._id) !== String(req.user._id))
      return res.status(401).send({ err: "Cannot update profile" });
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

    await Users.findByIdAndDelete(id);
    return res.status(200).send({ msg: "Account deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};
