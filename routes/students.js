const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  getStudents,
  addNewStudent,
  createNewStudent,
  getStudentEntry,
  updateStudentEntry,
  deleteStudent,
} = require("../controllers/student");

// Get all students
router.get("/", getStudents);

router.get("/new", addNewStudent);

router.post("/", createNewStudent);

// router.get("/students/:id/edit", getStudentEntry);
router.get("/edit/:id", getStudentEntry);
// console.log("updateing")
router.post("/:id", updateStudentEntry);
// router.post("/:id/edit", updateStudentEntry);
// router.post("students/edit/:id", updateStudentEntry);

router.post("/delete/:id", deleteStudent); // Use :id in the route to capture the student ID

module.exports = router;
