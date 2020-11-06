const express = require("express");
const { body } = require("express-validator/check");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const router = express.Router();

const feedController = require("../controllers/feed");

//GET POSTS

router.get("/posts", feedController.getPosts);

//create post
router.post(
  "/posts",
  checkAuth,
  extractFile,
  [
    body("title").trim().isLength({ min: 3 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

//GET SINGLE T POST
router.get("/posts/:postId", feedController.getPost);

//Update post
router.put(
  "/posts/:postId",
  checkAuth,
  extractFile,
  [
    body("title").trim().isLength({ min: 3 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

// DELETE POST
router.delete("/posts/:postId", checkAuth, feedController.deletePost);

module.exports = router;
