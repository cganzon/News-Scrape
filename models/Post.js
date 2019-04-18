const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema ({
    postTitle: {
        type: String,
        required: true,
    },
    postImage: {
        type: String,
        required: true,
    },
    postDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    postLink: {
        type: String,
        required: true,
    },
    postSummary: {
        type: String,
        required: true,
    }
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;