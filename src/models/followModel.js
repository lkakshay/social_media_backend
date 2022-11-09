const mongoose = require("mongoose");

followSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      
    },
    following_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Follow",followSchema);
