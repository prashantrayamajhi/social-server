const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * Message schema that has reference to user schema
 */
const messageSchema = Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    message: String,
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Message", messageSchema);
