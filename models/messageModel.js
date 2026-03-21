const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    conversation: { type: mongoose.Types.ObjectId, ref: "conversation" },
    sender: { type: mongoose.Types.ObjectId, ref: "user" },
    recipient: { type: mongoose.Types.ObjectId, ref: "user" },
    text: String,
    media: Array,
    status: { type: String, default: 'sent' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("message", messageSchema);
