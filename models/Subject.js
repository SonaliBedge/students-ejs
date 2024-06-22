const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema(
  {
    SubjectName: {
      type: String,
      require: [true, "Please provide subject name"],
      maxlength: 200,
    },
   
   
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", SubjectSchema);
