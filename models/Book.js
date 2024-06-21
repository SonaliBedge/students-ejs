const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    BookName: {
      type: String,
      require: [true, "Please provide book name"],
      maxlength: 200,
    },
    BookAuthor: {
      type: String,
      require: [true, "Please provide book author"],
      maxlength: 200,     
      default: "Not Specified",
    },

    BookType: {
      type: String,
      require: [true, "Please provide book type"],
      enum: ["Fiction", "Non-fiction"],
      default: "Not Specified",
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", BookSchema);
