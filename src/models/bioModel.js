const mongoose = require("mongoose");

bioSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true 
    },
    about:{type:String,default:'Hi am in'},
    imgUrl: { type: String ,default:null},
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Bio",bioSchema);
