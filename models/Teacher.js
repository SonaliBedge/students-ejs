const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema(
  {
    TeacherName: {
      type: String,
      require: [true, "Please provide teacher name"],
      maxlength: 200,
    },
    TeacherQualification: {
      type: String,
      require: [true, "Please provide teacher Qualification"],
      enum: ["Under Graduation", "Graduation", "Post Graduation"],
      default: "Graduation",
    },

    Subject: {
      type: String,
      enum: ["English", "Mathametics", "Science", "History", "Computer", "All"],
      default: "All",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", TeacherSchema);
