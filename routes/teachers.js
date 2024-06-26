const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  getTeachers,
  addNewTeacher,
  createNewTeacher,
  getTeacherEntry,
  updateTeacherEntry,
  deleteTeacher,
} = require("../controllers/teacher");

const { getSubjectData } = require("../controllers/subject");
// Get all teachers
router.get("/", getTeachers);

router.get("/new",getSubjectData, addNewTeacher);

router.post("/", createNewTeacher);

router.get("/edit/:id",getSubjectData, getTeacherEntry);

router.post("/:id", updateTeacherEntry);

router.post("/delete/:id", deleteTeacher); // Use :id in the route to capture the teacher ID

module.exports = router;
