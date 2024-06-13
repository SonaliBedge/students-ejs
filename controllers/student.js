

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
  res.render("students");
};

const createNewStudent = async (req, res) => {
  const newStudent = new Student({ ...req.body, createdBy: req.user._id });
  try {
    await newStudent.save();
    res.redirect("/students");
  } catch (err) {
    if (err.constructor.name === "ValidationError") {
      parseVErr(err, req);
    } else {
      req.flash("error", "Error creating student.");
    }
    res.render("student", { student: newStudent, errors: req.flash("error") });
  }
};

const getStudentEntry = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    res.render("students", { student });
  } catch (err) {
    req.flash("error", "Error fetching student.");
    res.redirect("/students");
  }
};

const updateStudentEntry = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    Object.assign(student, req.body);
    await student.save();
    res.redirect("/students");
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
