const mongoose = require("mongoose");
const { Schema } = mongoose;


const postSchema = new Schema(
  {
    content: String,
    images: {
      type: Array,
      required: true,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "comment",
      },
    ],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      default: null,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    reports: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    category: {
      type: String,
      default: "General",
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('post', postSchema);