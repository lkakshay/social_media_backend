const express = require("express");
const router = express.Router();
const PostController=require('../controllers/postController');
const uploadfile = require("../middlewares/fileUpload");



router.post("/create",uploadfile,PostController.create)
router.get("/home/:page",PostController.home) 
router.get("/:username/:page",PostController.byuser)
router.get("/explore",PostController.explore)
router.post("/like/:post_id",PostController.like)
router.delete("/like/:post_id",PostController.unlike)

module.exports = router;
