const Post = require("../models/post");
const { validationResult } = require("express-validator/check");
//get all posts
exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  let fetchedPosts;
  const postsQuery = Post.find();
  if (pageSize && currentPage) {
    postsQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postsQuery
    .then((posts) => {
      if (!posts) {
        throw new Error("no posts found");
      }
      fetchedPosts = posts;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        posts: fetchedPosts,
        message: "posts fretched successfully",
        maxPosts: count,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      err.message = "fetching posts failed!";
      next(err);
    });
};

//create post
exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  // const image = req.file.path;
  const url = req.protocol + "://" + req.get("host");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation failed! please enter valid data");
    error.statusCode = 422;
    throw error;
  }

  const newPost = new Post({
    title: title,
    content: content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  // console.log(req.userData)
  // return res.status(200).json({})
  newPost
    .save()
    .then((post) => {
      res.status(201).json({ message: "post created .", post: post });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      err.message = "creating post failed!";
      next(err);
    });
};

//get single post
exports.getPost = (req, res, next) => {
  Post.findById(req.params.postId)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      err.message = "fetching post failed!";
      next(err);
    });
};

//update post
exports.updatePost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");

  const title = req.body.title;
  const content = req.body.content;
  const _id = req.body._id;
  let imagePath = req.body.imagePath;
  if (req.file) {
    imagePath = url + "/images/" + req.file.filename;
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation failed! please enter valid data");
    error.status = 422;
    throw error;
  }
  const updatedPost = new Post({
    _id: _id,
    title: title,
    content: content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });

  Post.updateOne(
    { _id: req.params.postId, creator: req.userData.userId },
    updatedPost
  )
    .then((post) => {
      console.log(post);
      if (post.n > 0) {
        res.status(200).json({ message: "post updated" });
      } else {
        res.status(401).json({ message: "not Authorized" });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      err.message = "updating post failed!";
      next(err);
    });
};
//delete post
exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.deleteOne({ _id: postId, creator: req.userData.userId })
    .then((result) => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "post deleted" });
      } else {
        res.status(401).json({ message: "not Authorized" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
