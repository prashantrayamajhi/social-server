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

exports.updateUser = (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  console.log(req.file);
  console.log(req.files);
  try {
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  try {
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};
