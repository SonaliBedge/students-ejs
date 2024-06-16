const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    StudentName: {
      type: String,
      require: [true, "Please provide student name"],
      maxlength: 200,
    },
    SchoolName: {
      type: String,
      require: [true, "Please provide school name"],
      maxlength: 200,
    },
    Grade: {
      type: String,
      require: [true, "Please provide grade level"],
      maxlength: 50,
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

module.exports = mongoose.model("Student", StudentSchema);
