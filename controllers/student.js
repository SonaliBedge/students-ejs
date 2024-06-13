const Student = require("../models/Student.js");
const parseVErr = require("../utils/parseValidationErrs.js");

const getStudents = async (req, res) => {
  try {
    const students = await Student.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.render("students", { students });
  } catch (err) {
    req.flash("error", "Error fetching students.");
    res.redirect("/students");
  }
};

const addNewStudent = (req, res) => {
  console.log("new entry");
  res.render("student", {
    title: "Add Student",
    action: "/students",
    submitButtonLabel: "Add",
    student: null,
  });
};

const createNewStudent = async (req, res) => {
  try {
    // console.log("new entry", req.body);
    const { SchoolName, Grade, Subject } = req.body;
    // Assuming Student is your Mongoose model
    const newStudent = await Student.create({
      SchoolName,
      Grade,
      Subject,
      createdBy: req.user._id, // Assuming you're storing the user who created the student
    });
    // console.log("New student created:", newStudent);
    res.redirect("/students"); // Redirect to the students list page or any other page
  } catch (err) {
    console.error("Error creating new student:", err);
    req.flash("error", "Error creating new student.");
    res.redirect("/students"); // Redirect to an error page or any other page
  }
};

const getStudentEntry = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    res.render("student", {
      title: "Edit Student",
      //   action: `/students/${student.id}/edit`,
      action: `/students`,
      submitButtonLabel: "Update",
      student: student,
    });
    // console.log("updateing new");
    // res.render("students", { student });
  } catch (err) {
    req.flash("error", "Error fetching student.");
    res.redirect("/students");
  }
};

const updateStudentEntry = async (req, res) => {
  try {
    // console.log("updateing");

    const student = await Student.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!student) {
      req.flash("error", "Student not found.");
      return res.redirect("/students");
    }
    // console.log("updated data", req.body);
    Object.assign(student, req.body);
    await student.save();
    res.redirect(`/students/${student._id}`);
  } catch (err) {
    if (err.constructor.name === "ValidationError") {
      parseVErr(err, req);
    } else {
      req.flash("error", "Error updating student.");
    }
    res.render("student", { student: req.body, errors: req.flash("error") });
  }
};

const deleteStudent = async (req, res) => {
  try {
    await Student.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    res.redirect("/students");
  } catch (err) {
    req.flash("error", "Error deleting student.");
    res.redirect("/students");
  }
};

module.exports = {
  getStudents,
  addNewStudent,
  createNewStudent,
  getStudentEntry,
  updateStudentEntry,
  deleteStudent,
};
