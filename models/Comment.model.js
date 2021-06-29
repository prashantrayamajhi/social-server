const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * Comments schema that has reference to Post and user schemas
 */
const commentSchema = Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);
