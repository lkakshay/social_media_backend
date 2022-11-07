const express = require("express");
const router = express.Router();
const ProfileController=require('../controllers/ProfileController');
const uploadfile = require("../middlewares/fileUpload");



router.get("/client",ProfileController.clientData)
router.get("/bio/:username",ProfileController.getBio)
router.patch("/bio",uploadfile,ProfileController.editBio)

module.exports = router;
