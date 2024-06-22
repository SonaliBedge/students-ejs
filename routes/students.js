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

const { getSubjectData } = require("../controllers/subject");
// Get all students
router.get("/", getStudents);

router.get("/new",getSubjectData, addNewStudent);

router.post("/",  createNewStudent);

router.get("/edit/:id",getSubjectData, getStudentEntry);

router.post("/:id", updateStudentEntry);

router.post("/delete/:id", deleteStudent); // Use :id in the route to capture the student ID

module.exports = router;
