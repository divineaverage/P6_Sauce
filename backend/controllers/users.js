import User from "../models/users.js";
import bcrypt from'bcrypt';
import jwt from'jsonwebtoken';

class UsersController {
//Signup
  async signup(req, res) {
    try {
      let user = await User.findOne({
        username: req.body.username,
      });

      if (user) {
        return res.status(401).json({
          error: true,
          message: "Username is already in use.",
        });
      }

      bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({message: "User created." }))
                .catch(error => res.status(400).json({ message: error.message }));
        })
        .catch(error => res.status(500).json({ message: error.message }));
}

      catch { res.status(201).json(user);
    } finally {
      console.error(error);
      return res.status(500).json({
        error: true,
        message: "Cannot Sign up",
      });
    }
  }
//Login
  async login(req, res) {
    if (!req.body.username) {
      return res.status(400).json({
        message: "Username is required.",
      })
    }
    else if (!req.body.password) {
      return res.status(400).json({
        message: "Password is required."
      })
    }
    try {
      let user = await User.findOne({ username: req.body.username });

      if (!user) {
        return res.status(404).json({
          error: true,
          message: "Account not found.",
        });
      }

      const isValid = await bcrypt.compare(req.body.password, user.password)
      

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

      return res.status(200).json({
        success: true,
        message: "Successful login.",
      });
  }} catch (error) {
      console.error(error);
      return res.status(500).json({
        error: true,
        message: "Couldn't login. Please try again.",
      });
    }
  }
}

export default UsersController;