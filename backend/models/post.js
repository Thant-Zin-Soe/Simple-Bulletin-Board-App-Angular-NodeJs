const mongoose = require('mongoose');

const postSchmea = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String },
    imagePath: { type: String},
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});


module.exports = mongoose.model('Post', postSchmea);