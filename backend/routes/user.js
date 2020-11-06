const express = require("express");

const router = express.Router();
const userController = require("../controllers/user");
//Sign up user

router.post("/signup", userController.signupUser);

//login
router.post("/login", userController.login);

module.exports = router;
