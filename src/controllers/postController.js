const Bio = require("../models/bioModel");
const Follow = require("../models/followModel");
const Like = require("../models/likeModel");
const Post = require("../models/postModel");
const User = require("../models/userModel");

const create = async (req, res) => {
  try {
    const data = await Post.create(req.body);
    return res.status(202).send(data);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const byuser = async (req, res) => {
  const skip = (+req.params.page - 1) * 10;
  try {
    const client = await User.findOne({ _id: req.body.user_id });

    const user = await User.findOne({ username: req.params.username });
    const docs = await User.aggregate([
      {
        $match: {
          _id: user._id,
        },
      },

      {
        $project: { _id: 0, user_id: "$_id", username: 1 },
      },
      {
        $lookup: {
          from: "posts",
          localField: "user_id",
          foreignField: "user_id",
          as: "post",
        },
      },
      { $unwind: "$post" },
      {
        $sort: {
          "post.createdAt": -1,
        },
      },
      {
        $lookup: {
          from: "bios",
          localField: "user_id",
          foreignField: "user_id",
          as: "bio",
        },
      },
      { $unwind: "$bio" },
      {
        $project: {
          post: 1,
          user_id: 1,
          profilePic: "$bio.imgUrl",
          username: 1,
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "post._id",
          foreignField: "post_id",
          as: "like",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "like.user_id",
          foreignField: "_id",
          as: "likedUsers",
        },
      },
      {
        $project: {
          user_id: 1,
          profilePic: 1,
          username: 1,
          post: 1,
          "likedUsers.username": 1,
          "likedUsers._id": 1,
          isLiked: { $in: [client._id, "$likedUsers._id"] },
        },
      },
      {
        $project: {
          "post.user_id": 0,
        },
      },
      {
        $group: {
          _id: null,
          ROOT: { $push: "$$ROOT" },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalPages: { $ceil: { $divide: ["$total", 10] } },
          posts: { $slice: ["$ROOT", skip, 10] },
        },
      },
    ]);

    return res.status(200).send(docs[0]);
  } catch (e) {
    console.log("e", e);
    res.status(500).send(e.message);
  }
};

const like = async (req, res) => {
  try {
    const data = await Like.create({
      post_id: req.params.post_id,
      user_id: req.body.user_id,
    });
    return res.status(202).send(data);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const unlike = async (req, res) => {
  try {
    const data = await Like.deleteMany({
      post_id: req.params.post_id,
      user_id: req.body.user_id,
    });

    return res.status(200).send(data);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const explore = async (req, res) => {
  try {
    const client = await User.findOne({ _id: req.body.user_id });
    const data = await Post.aggregate([

      {
        $match: {
          user_id: { $ne: client._id },
        },
      },
      {
        $group: {
          post: { $push: "$$ROOT" },
          _id: client._id,
        },
      },
      { $unwind: "$post" },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "user_id",
          as: "following",
        },
      },
      {
        $project: {
          _id: 1,
          following_id: "$following.following_id",
          isFollowing: { $in: ["$post.user_id","$following.following_id"] },
          post: 1,
        },
      },
     
      {
        $match: {
          isFollowing:false,
        },
      },

      {
        $sample: { size:12},
      },
    

      {
        $project: {
          _id:0,
          post: 1,
        },
      },
      {
        $lookup: {
          from: "bios",
          localField: "post.user_id",
          foreignField: "user_id",
          as: "bio",
        },
      },
      { $unwind: "$bio" },
      {
        $project: {
          post: 1,
          user_id: "$bio.user_id",
          profilePic: "$bio.imgUrl",
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          post: 1,
          user_id: 1,
          profilePic: 1,
          username: "$user.username",
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "post._id",
          foreignField: "post_id",
          as: "like",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "like.user_id",
          foreignField: "_id",
          as: "likedUsers",
        },
      },

      {
        $project: {
          _id: 1,
          user_id: 1,
          profilePic: 1,
          username: "$user.username",
          post: 1,
          "likedUsers.username": 1,
          "likedUsers._id": 1,
          username: 1,
          isLiked: { $in: [client._id, "$likedUsers._id"] },
        },
      },
    ]);
    console.log(data[0]);
    console.log(data.length);

    return res.status(200).send(data);
  } catch (e) {
    console.log("e", e);
    res.status(500).send(e.message);
  }
};

const home = async (req, res) => {
  const skip = (+req.params.page - 1) * 10;

  try {
    const client = await User.findOne({ _id: req.body.user_id });
    const docs = await User.aggregate([
      {
        $match: {
          _id: client._id,
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "user_id",
          as: "following",
        },
      },
      {
        $project: { _id: 1, following_id: "$following.following_id" },
      },
      { $unwind: "$following_id" },

      {
        $lookup: {
          from: "bios",
          localField: "following_id",
          foreignField: "user_id",
          as: "bio",
        },
      },

      {
        $project: {
          _id: 1,
          following_id: "$following_id",
          profilePic: "$bio.imgUrl",
        },
      },
      { $unwind: "$profilePic" },

      {
        $lookup: {
          from: "users",
          localField: "following_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 1,
          user_id: "$following_id",
          profilePic: 1,
          username: "$user.username",
        },
      },

      { $unwind: "$username" },

      {
        $lookup: {
          from: "posts",
          localField: "user_id",
          foreignField: "user_id",
          as: "post",
        },
      },
      {
        $project: {
          _id: 1,
          user_id: 1,
          profilePic: 1,
          username: 1,
          post: 1,
        },
      },
      { $unwind: "$post" },
      {
        $sort: {
          "post.createdAt": -1,
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "post._id",
          foreignField: "post_id",
          as: "like",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "like.user_id",
          foreignField: "_id",
          as: "likedUsers",
        },
      },
      {
        $project: {
          _id: 1,
          user_id: 1,
          profilePic: 1,
          post: 1,
          "likedUsers.username": 1,
          "likedUsers._id": 1,
          username: 1,
          isLiked: { $in: ["$_id", "$likedUsers._id"] },
        },
      },
      {
        $project: {
          _id: 0,
          "post.user_id": 0,
        },
      },
      {
        $group: {
          _id: null,
          ROOT: { $push: "$$ROOT" },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalPages: { $ceil: { $divide: ["$total", 10] } },
          posts: { $slice: ["$ROOT", skip, 10] },
        },
      },
    ]);
    return res.status(200).send(docs[0]);
  } catch (e) {
    console.log("e", e);
    res.status(500).send(e.message);
  }
};

module.exports = { create, byuser, like, unlike, explore, home };
