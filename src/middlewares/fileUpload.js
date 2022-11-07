const fileUpload = require("express-fileupload");
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: "public_ZNIIUqrjtUcM2q/qj7KAw7rJNWQ=",
  privateKey: "private_RNXeOiiq3O7IlNvCrBW0y7FXXfA=",
  urlEndpoint: "https://ik.imagekit.io/g3buj3pst",
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
