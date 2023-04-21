import express from 'express';
import cors from "cors";
import mongoose from 'mongoose';
import user from "./models/users.js";
import UsersController from "./controllers/users.js";
import auth from './middleware/auth.js';
import multer from './middleware/multer-config.js';
import {config} from "dotenv";
import { createSauce, deleteSauce, getAllSauce, getOneSauce, likeSauce, modifySauce } from './controllers/sauces.js';
const {MONGODBURL} = config().parsed;
export const app = express();

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
    email: req.body.email,
    password: req.body.body
  })
  post.save(function (err, post) {
    if (err) { return next(err) }
    res.json(201, post)
  })
})

//Sauce functions
app.post('/', auth, multer, createSauce);
app.put('/:id', auth, multer, modifySauce);
app.delete('/:id', auth, deleteSauce);
app.get('/:id', auth, getOneSauce);
app.get('/api/sauces', auth, getAllSauce);
app.post('/:id/like', auth, likeSauce);

export default app;