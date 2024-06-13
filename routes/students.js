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
// router.get("/", async (req, res) => {
//   try {
//     const students = await getStudents(); // Call the getStudents function to fetch students
//     res.render("/", { students }); // Pass fetched students to the view
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching students");
//   }
// });
router.get("/new", addNewStudent);

router.post("/students", createNewStudent);

router.get("/edit/:id", getStudentEntry);

router.post("/edit/:id", updateStudentEntry);

router.post("/delete/:id", deleteStudent); // Use :id in the route to capture the student ID

module.exports = router;
