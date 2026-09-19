const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    tags: { type: [String], default: [] },
    replies: { type: [replySchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
