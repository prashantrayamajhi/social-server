const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User schema that has references to Post, Like, Comment, Follow and Notification schemas
 */
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      max: 80,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    password: {
      type: String,
      required: true,
    },
    image: String,
    imagePublicId: String,

    isOnline: {
      type: Boolean,
      default: false,
    },
    dateOfBirth: {
      type: Date,
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    posts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Post",
      },
    ],
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Like",
      },
    ],
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
    followers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    notifications: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Notification",
      },
    ],
    messages: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],

    github: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    youtube: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    instagram: {
      type: String,
      trim: true,
    },
    facebook: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Hashes the users password when saving it to DB
 */
UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  });
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
