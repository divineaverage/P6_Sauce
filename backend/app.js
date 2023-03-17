const express = require('express');
const cors = require("cors");
const app = express();
const {MONGODBURL} = require("dotenv").config().parsed;
const mongoose = require('mongoose');
const user = require("./models/users");
import UsersController from "./controllers/users";
const sauceCtrl = require('../controllers/sauce-ctrl');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

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
app.use("/api/auth/signup", UsersController.signup)

//Login
app.use("/api/auth/login", UsersController.login)

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

//Sauce functions
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/:id/like', auth, sauceCtrl.likeOrDislike);

module.exports = app;