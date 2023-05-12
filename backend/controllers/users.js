import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UsersController {
//Signup
  static async signup(req, res) {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        return res.status(401).json({
          error: true,
          message: "Username is already in use.",
        });
      }

      bcrypt.hash(req.body.password, 10)
      .then((hash) => {
        const user = new user({
            email: req.body.email,
            password: hash
        });
        user.save((err) => {
          if (err) return res.status(400).json({ message: err.message || err })
        });
    return (error => res.status(500).json({ message: error.message }));
  });
  };

//Login
  static async login(req, res) {
    if (!req.body.email) {
      return res.status(400).json({
        message: "Username is required.",
      })
    }
    else if (!req.body.password) {
      return res.status(400).json({
        message: "Password is required."
      })
    }
      let user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(404).json({
          error: true,
          message: "Account not found.",
        });
      }

      bcrypt.compare(req.body.password, user.password)
      .then(async (isValid) => {

      if (!isValid) {
        return res.status(401).json({
          error: true,
          message: "Invalid password.",
        });
      } else {
        let token = jwt.sign(
            { userId: user._id },
            process.env.TOKEN_SECRET,
            { expiresIn: '24h' }
        );
        res.status(200).json({
            userId: user._id,
            token: token
        });
      }})

      

    }
  }

export default UsersController;