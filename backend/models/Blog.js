const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  text: { type: String, required: true },
}, { timestamps: true });

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: {type: String, required: true},
    userId: {type: String, required: true},
    likes: [{type: String}],
    comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);