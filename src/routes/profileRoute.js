const express = require("express");
const router = express.Router();
const ProfileController=require('../controllers/ProfileController');
const uploadfile = require("../middlewares/fileUpload");



router.get("/client",ProfileController.clientData)
router.get("/bio/:username",ProfileController.getBio)
router.patch("/bio",uploadfile,ProfileController.editBio)
router.post("/follow/:user_id",ProfileController.follow)
router.delete("/follow/:user_id",ProfileController.unfollow)


module.exports = router;

