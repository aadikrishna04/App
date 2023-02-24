// Required imports
const express = require("express");
const router = express.Router();

// Import User, Post, and Follow Controllers
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const FollowController = require("./controllers/followController");

// Default site routing... When base route is accessed, redirect to login
router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", userController.signup);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", userController.login);
router.get("/logout", userController.logout);

router.get("/feed", userController.feed);

router.post("/create-post", postController.post);

router.get("/post/:id", postController.singlePost);

router.get("/profile", function (req, res) {
  res.render("profile");
});

router.post("/follow", FollowController.follow);
router.post("/unfollow", FollowController.unfollow);

// Export site routing
module.exports = router;
