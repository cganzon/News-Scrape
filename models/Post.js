const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema ({
    postTitle: {
        type: String,
        required: true
    },
    postImage: {
        type: String,
        required: true
    },
    postDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    postLink: {
        type: String,
        required: true,
        unique: true
    },
    postSummary: {
        type: String,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;