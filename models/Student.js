const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
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
    // Grade: {
    //     type: Number,
    //     require: [true, "Please provide grade level"],
    // enum = ['1','2','3','4','5','6','7','8']
    //     maxlength: 2,
    //   },
    Subject: {
      type: String,
      enum: ["English", "Mathametics", "Science", "History", "Computer","All"],
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
