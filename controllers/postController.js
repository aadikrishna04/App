const Post = require("../models/Post").default; // This line imports the default export of the Post model. It is used to create new post instances and call methods on them.

exports.post = function (req, res) {
  let post = new Post(req.body, req.session.user._id); // This line creates a new post instance and passes the request body and the user id from the session as arguments.
  post.create(); // This line calls the create() method on the post instance which is responsible for creating the post.
  res.redirect("/feed"); // This line redirects the user to the feed page after the post has been created.
};

exports.singlePost = async function (req, res) {
  try {
    let post = await Post.singlePost(req.params.id); // This line calls the singlePost() method on the Post model and passes the id from the request parameters as an argument. It awaits the promise returned by the method and assigns the result to the post variable.
    res.render("post", { post: post }); // This line renders the post view and passes the post variable as a local variable to the view.
  } catch {
    res.send("404 Error. Post not found."); // This line sends a 404 error message to the user if an error occurs when trying to retrieve the post.
  }
};