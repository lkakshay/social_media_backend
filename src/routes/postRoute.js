const express = require("express");
const router = express.Router();
const PostController=require('../controllers/postController');
const uploadfile = require("../middlewares/fileUpload");



router.post("/create",uploadfile,PostController.create)
router.get("/:username/:page",PostController.byuser)
router.post("/like/:post_id",PostController.like)
router.delete("/like/:post_id",PostController.unlike)

module.exports = router;
