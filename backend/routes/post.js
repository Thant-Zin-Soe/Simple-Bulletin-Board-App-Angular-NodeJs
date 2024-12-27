const express = require('express');
const Post = require('../models/post');
const jwt = require('jsonwebtoken');
const router = express.Router();
const multer = require("multer");

const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP= {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let erro = new Error("invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "backend/image");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now()+'.'+ext);
    }
});


router.post("", checkAuth, multer({storage: storage}).single("image") ,(req, res, next) => {
    const url = req.protocol + '://' +req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url+"/image/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath
            }
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Creating a post falied!"
        });
    });
});

router.put("/:id", checkAuth, multer({storage: storage}).single("image") ,(req, res, next) => {
    console.log("asdfasfasdfasdfasdfasdfasdfasdfasdf");
    let imagePath =  req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' +req.get("host");
        imagePath = url + "/image/" + req.file.filename
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Post.updateOne({_id: req.params.id, creator: req.userData.userId }, post).then(result => {
        if ( result.nModified > 0) {
            res.status(200).json({message: 'Updated successful'});
        } else {
            res.status(401).json({message: 'Not authorized'});
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Couldn't update post!"
        });
    }); 
});

router.put("/like/:id",checkAuth, (req, res, next) => {
    // console.log(req.body.id)
    // console.log(req.body.isLiked);
    userId = req.userData.userId;
    if(req.body.isLiked == "Like") {
        Post.update({_id: req.body.id},{$push:{ like: userId}}, (err, result) => {
            if (result) {
                res.status(200).json({message: 'Update successful'});
            }
        })
    } else {
        Post.update({_id: req.body.id},{$pull:{ like: userId}}, (err, result) => {
            if (result) {
                res.status(200).json({message: 'Update successful'});
            }
        })
    }
})


router.get("",(req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPost;
    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1))
        .limit(pageSize);    
    }
    postQuery.populate('creator').populate('like')
    .then(documents => {
        fetchedPost = documents;
        //console.log(documents);
        return Post.count();
    })
    .then(count => {
        res.status(200).json({
            message: "Post fatched successfully",
            post: fetchedPost,
            maxPosts: count,
        })
        // .catch(error => {
        //     res.status(500).json({ message: "Fetchaing posts falied!"});
        // });
    });
});

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if(post) {
            res.status(200).json(post);
        }else {
            res.status(404).json({message: 'Post is not founded.'})
        }
    })
    .catch(error => {
        res.status(500).json({ message: "Fetchaing posts falied!"});
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
        if ( result.n > 0) {
            res.status(200).json({message: 'Deleted successful'});
        } else {
            res.status(401).json({message: 'Not authorized'});
        }
    })
    .catch(error => {
        res.status(500).json({ message: "Fetchaing posts falied!"});
    });
});

module.exports = router;