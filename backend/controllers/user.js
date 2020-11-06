const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
exports.signupUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    newUser
      .save()
      .then((user) => {
        res.status(200).json({
          message: "User created successfuly!",
          user: user,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Invalid Authentication credentials!",
        });
      });
  });
};

exports.login = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Auth Failed",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid Authentication credentials!",
        });
      }

      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({
        message: "Invalid Authentication credentials!",
      });
    });
};
