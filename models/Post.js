const postsCollection = require("../db").db().collection("posts");
const ObjectID = require("mongodb").ObjectId;

function Post(data, userid) {
  this.data = data;
  this.userid = userid;
  this.data.author = ObjectID(userid);
}

Post.prototype.create = function (req, res) {
  return new Promise((resolve, reject) => {
    postsCollection
      .insertOne(this.data)
      .then(() => {
        resolve();
      })
      .catch(() => {
        res.send("Application error... Please try again later");
      });
  });
};

Post.singlePost = function (id) {
  return new Promise(async function (resolve, reject) {
    if (typeof(id) != "string" || !ObjectID.isValid(id)) {
      reject();
      return;
    }
    let posts = await postsCollection.aggregate([
      {$match: {_id: new ObjectID(id)}},
      {$lookup: {from: "users", localField: "author", foreignField: "_id", as: "authorDocument"}},
      {$project: {
        body: 1,
        date: 1,
        author: {arrayElemAt: ["authorDocument", 0]},
      }}
    ]).toArray()
    if (posts.length) {
      console.log(posts[0])
      resolve(posts[0]);
    } else {
      reject();
    }
  });
};

module.exports = Post;
