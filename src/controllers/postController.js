const Bio = require("../models/bioModel");
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

  
  try {
    const user = await User.findOne({ username: req.params.username });
    const NoOfDocs= await Post.find({user_id: user._id}).count()
    const totalpages=Math.ceil(NoOfDocs/10)
    const data = await Post.aggregate([
      {
        $match: {
          user_id: user._id,
        },
        
      },
     
      {$sort:{
        "createdAt":-1
      }},
      {
        $lookup: {
          from: "bios",
          localField: "user_id",
          foreignField: "user_id",
          as: "bio",
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
      { $unwind: "$bio",},
      { $unwind: "$user",},
     
      
      {$skip:10*(req.params.page-1)},
      {$limit:10},

      {
        $project: { _id: 1, profilePic: "$bio.imgUrl",username: "$user.username", content: 1, imgUrl: 1 , createdAt:1,updatedAt:1},
      },
      
    ]);

   
  

    return res.status(200).send({ posts: data,totalpages });
  } catch (e) {
    console.log("e", e);
    res.status(500).send(e.message);
  }
};


module.exports = { create, byuser };
