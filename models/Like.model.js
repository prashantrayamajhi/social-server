const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * Like schema that has references to Post and User schema
 */
const likeSchema = Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Like", likeSchema);
