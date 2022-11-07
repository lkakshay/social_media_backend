const Bio = require("../models/bioModel");
const User = require("../models/userModel");

const clientData = async (req, res) => {
  try {
    const data = await Bio.findOne({ user_id: req.body.user_id }).populate(
      "user_id"
    );
    return res
      .status(200)
      .send({ username: data.user_id.username, profilePic: data.imgUrl });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const getBio = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const data = await Bio.findOne({ user_id: user._id }).populate(
      "user_id",
      "username"
    );

    return res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
};

const editBio = async (req, res) => {
  try {
      const data = await Bio.findOneAndUpdate({user_id:req.body.user_id},req.body)
      return res.status(200).send(data);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

module.exports = { clientData, editBio, getBio };
