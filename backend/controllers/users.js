import User from "../models/user.model.js";

class UsersController {
  async signup(req, res) {
    try {
      let user = await User.findOne({
        username: req.body.username,
      });

      if (user) {
        return res.status(400).json({
          error: true,
          message: "Username is already in use",
        });
      }

      user = new User(req.body);

      await user.save();

      return res.status(201).send(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: true,
        message: "Cannot Sign up",
      });
    }
  }
}

export default UsersController;