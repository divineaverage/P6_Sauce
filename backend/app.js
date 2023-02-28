const express = require('express');
const cors = require("cors");
const app = express();
const {MONGODBURL} = require("dotenv").config().parsed;
const mongoose = require('mongoose');
const user = require("./models/users")

console.log(MONGODBURL);

app.use(cors());
app.use(express.json());

mongoose.connect(MONGODBURL)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

//Sign up
app.use("/api/auth/signup",(req, res) => {
    res.status(201).json({ message: 'Your request was successful!' });
});

//Login
app.use("/api/auth/login",(req, res) => {
    res.status(201).json({ message: 'Your request was successful!' });
});

app.post('/api/posts', function (req, res, next) {
  var post = new user({
    email: req.body.username,
    password: req.body.body
  })
  post.save(function (err, post) {
    if (err) { return next(err) }
    res.json(201, post)
  })
})

module.exports = app;