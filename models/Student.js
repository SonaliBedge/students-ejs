const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    StudentName: {
      type: String,
      require: [true, "Please provide student name"],
      maxlength: 200,
    },
    StudentAge: {
      type: Number,
      require: [true, "Please provide age of student"],     
      default: 0,
    },
    SchoolName: {
      type: String,
      require: [true, "Please provide school name"],
      maxlength: 200,
    },
    Grade: {
      type: String,
      require: [true, "Please provide grade level"],
      enum: ["Kindergarten","1 grade", "2 grade", "3 grade", "4 grade", "5 grade", "6 grade","7 grade","8 grade","9 grade","10 grade","11 grade","12 grade"],
      maxlength: 50,
    },
    Subject: {
      type: [String],   
      required: [true, "At least one Subject must be selected."],   
      // default: [],
    },
    IsImmunizationAvailable: {
      type: Boolean,      
      default: false,
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
