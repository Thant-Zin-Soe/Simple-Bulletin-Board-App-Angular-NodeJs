const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

router.put('/:id', (req, res, next) => {
    const user = new User({
        _id: req.body.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    });
    console.log(user.firstName + user.lastName + user.email)
    User.updateOne({_id: req.params.id}, user).then(result => {
        if ( result.nModified > 0 ) {
            res.status(200).json({message: 'Update successful'});
        }
    })
})

router.post("/register", (req,res, next) => {
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });
    user.save()
    .then(result => {
        res.status(201).json({
            message:"User created",
            result:result
        });
    })
    //alart("User account is created..")
    .catch(err => {
        res.status(500).json({
            message: "Invalid authentication credentials!"    
        });
    });
});

router.get("/:id", (req,res, next) => {
    User.findById(req.params.id).then(user => {
        console.log(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({message: 'user is not found'})
        }
    })
})

router.post("/login", (req,res,next) => {
    let featchedUser;
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({
                message: "Login falied"
            });
    	}
        featchedUser = user;
        return req.body.password == user.password;
        })
        .then(result => {
            console.log(result);
            if (!result) {
                return res.status(401).json({
                    message: "Login falied"
                });
            }
            const token = jwt.sign(
                {email: featchedUser.email, userId: featchedUser._id, 
                    firstName: featchedUser.firstName, lastName: featchedUser.lastName, 
                    email: featchedUser.email},
                "secret_this_should_be_longer",
                {expiresIn: "1h" }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: featchedUser._id,
                firstName: featchedUser.firstName,
                lastName: featchedUser.lastName ,
                email: featchedUser.email
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(401).json({
                message: "Invalid authentication credentials!"
        });
    });
});
module.exports = router;
