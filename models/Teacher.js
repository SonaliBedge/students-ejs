const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema(
  {
    TeacherName: {
      type: String,
      require: [true, "Please provide teacher name"],
      maxlength: 200,
    },
    TeacherBirthDate: {
      type: Date,
      default: Date.now, // Set default value to current date and time
      required: [true, "Please provide teacher Birth Date"],
    },
    TeacherQualification: {
      type: String,
      require: [true, "Please provide teacher Qualification"],
      enum: ["Under Graduation", "Graduation", "Post Graduation"],
      default: "Graduation",
    },
    NoSemesterUnits: {
      type: Number,
      require: [true, "Please provide Number of Semester Units"],     
      default: 0,
    },
    Subject: {
      type: [String],      
      default: [],
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
