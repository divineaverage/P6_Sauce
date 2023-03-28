import express from 'express';
import cors from "cors";
import mongoose from 'mongoose';
import user from "./models/users";
import UsersController from "./controllers/users";
import auth from '../middleware/auth';
import multer from '../middleware/multer-config';
import {config} from "dotenv";
import { createSauce, deleteSauce, getAllSauce, getOneSauce, likeSauce, modifySauce } from './controllers/sauces';
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
    email: req.body.username,
    password: req.body.body
  })
  post.save(function (err, post) {
    if (err) { return next(err) }
    res.json(201, post)
  })
})

//Sauce functions
router.post('/', auth, multer, createSauce);
router.put('/:id', auth, multer, modifySauce);
router.delete('/:id', auth, deleteSauce);
router.get('/:id', auth, getOneSauce);
router.get('/', auth, getAllSauce);
router.post('/:id/like', auth, likeSauce);

export default app;