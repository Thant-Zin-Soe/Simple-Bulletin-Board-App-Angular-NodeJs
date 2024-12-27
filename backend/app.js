const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const cmtRoutes = require("./routes/comment");
const app = express();

mongoose.connect("mongodb://localhost")//+srv://Edward:D6mo4q9DcETMND5Z@cluster0-ax3kg.mongodb.net/node-anglar?retryWrites=true")
    .then(() => {
        console.log('Connected to database!');
    })
    .catch(() => {
        console.log('Connection failed!');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/image", express.static(path.join("backend/image")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/comment", cmtRoutes);

module.exports = app;