const mongoose = require("mongoose");

const cmtSchema = mongoose.Schema( {
    content: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true}
});

module.exports = mongoose.model('Comment', cmtSchema);