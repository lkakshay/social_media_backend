const Bio = require("../../models/bioModel");
const User = require("../../models/userModel");

const createToken = require("../../utils/helpers/createToken");

module.exports = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const about = await Bio.create({ user_id: user._id });
    const token = createToken(user._id);
    return res.status(201).send({ token });
  } catch (e) {
    res.status(500).send(e.message);
  }
};
