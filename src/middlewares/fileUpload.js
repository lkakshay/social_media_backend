const fileUpload = require("express-fileupload");
const ImageKit = require("imagekit");
require("dotenv").config();
const publicKey = process.env.PUBLICKEY;
const privateKey = process.env.PRIVATEKEY;
const urlEndpoint = process.env.URLENDPOINT;

const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});

const uploadToCloud = async (file) => {
  try {
    return await imagekit
      .upload({
        file: file.data,
        fileName: `${Date.now()}+${file.name}`,
      })
      .then((res) => {
        return res.url;
      });
  } catch (err) {
    return "error";
  }
};

const uploadfile = async (req, res, next) => {
  if (req.files) {
    const url = await uploadToCloud(req.files.image);
    if (url !== "error") req.body.imgUrl = url;
  }
  return next();
};

module.exports = uploadfile;
