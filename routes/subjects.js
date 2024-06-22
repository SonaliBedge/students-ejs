const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  getSubjects,
  addNewSubject,
  createNewSubject,
  getSubjectEntry,
  updateSubjectEntry,
  deleteSubject,
  getSubjectData,
} = require("../controllers/subject");

// Get all subjects
router.get("/", getSubjects);

router.get("/new", addNewSubject);

router.post("/", createNewSubject);

router.get("/edit/:id", getSubjectEntry);

router.post("/:id", updateSubjectEntry);

router.post("/delete/:id", deleteSubject); // Use :id in the route to capture the subject ID

// Add middleware to fetch subject data for student form
router.get("/students/new", getSubjectData, (req, res) => {
  res.render("student", {
    title: "Add Student",
    action: "/students",
    submitButtonLabel: "Add",
    student: null,
    subjects: res.locals.subjects,
  });
});

router.get("/students/edit/:id", getSubjectData, async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render("student", {
    title: "Edit Student",
    action: `/students/${student.id}?_method=PUT`,
    submitButtonLabel: "Update",
    student,
    subjects: res.locals.subjects,
  });
});

module.exports = router;
