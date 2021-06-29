const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("./../utils/generate-token");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send({ err: "Invalid credentials" });
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword)
      return res.status(401).send({ err: "Invalid credentials" });
    const token = generateToken(user, process.env.JWT_SECRET, "1d");
    const data = {
      token,
      id: user._id,
      email: user.email,
      name: user.name,
    };
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};

exports.signup = async (req, res) => {
  try {
    const { email, username, name, password, gender } = req.body;
    if (!email.trim()) {
      return res.status(400).send({ err: "Email cannot be empty" });
    }
    if (!username.trim()) {
      return res.status(400).send({ err: "Username cannot be empty" });
    }
    if (!name.trim()) {
      return res.status(400).send({ err: "Name cannot be empty" });
    }
    if (!gender.trim()) {
      return res.status(400).send({ err: "Gender cannot be empty" });
    }
    if (!password.trim()) {
      return res.status(400).send({ err: "Password cannot be empty" });
    }
    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });
    if (emailExists)
      return res.status(409).send({ err: "Email already registered" });
    if (usernameExists) return res.status(409).send({ err: "Username taken" });
    const user = new User({ email, username, name, password, gender });
    const data = await user.save();
    return res.status(201).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};
