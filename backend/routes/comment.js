const express = require("express");
const Comment = require("../models/comment");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

    router.post("",checkAuth, (req,res, next) => {
        const comment = new Comment({
            content:req.body.content,
            creator: req.userData.userId,
            postId: req.body.postId
    });
    console.log(req.body.postId);
    // return res.status(200).json({});
    comment.save().then(createdComment => {
        res.status(201).json({
            message: "Comment added successfully",
                cmtId: createdComment._id
            })
        })
    });

    router.get("", (req, res, next) => {
        Comment.find().populate('creator')
        .then(document => {
            res.status(200).json({
                messsage: "Comment featched successfully",
                comment: document               
            });
        })
        // .catch(error => {
        //     res.status(500).json({ message: "Fetchaing comment falied!" });
        // });
    })

    router.delete("/:id",checkAuth, (req, res, next) => {
        Comment.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
            if (result.n > 0) {
                res.status(200).json({message: "Deletion successful!"});
            } else {
                res.status(401).json({ message: "Not authorized!" });
            }
        });
    });


module.exports = router;