const express = require("express");
const router = express.Router();
const PostController=require('../controllers/postController');
const uploadfile = require("../middlewares/fileUpload");



router.post("/create",uploadfile,PostController.create)
router.get("/:username/:page",PostController.byuser)

module.exports = router;
