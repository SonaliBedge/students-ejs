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
  res.render("student", {
    title: "Add Student",
    action: "/students",
    submitButtonLabel: "Add",
    student: null,
    subject: [],
  });
};

const createNewStudent = async (req, res) => {
  try {
    const { StudentName, StudentAge, SchoolName, Grade, Subject, IsImmunizationAvailable } = req.body;
    
    // const subjects = Array.isArray(Subject) ? Subject : [Subject];

    const newStudent = await Student.create({
      StudentName,
      StudentAge,
      SchoolName,
      Grade,
      Subject: Array.isArray(Subject) ? Subject : [Subject], // Ensure Subjects is always an array           
      IsImmunizationAvailable : IsImmunizationAvailable === "true",
      createdBy: req.user._id,
    });
    res.redirect("/students"); // Redirect to the students list page or any other page
  } catch (err) {
    // if (err.name === "ValidationError") {
    //   const errors = Object.values(err.errors).map((error) => error.message);
    //   req.flash("error", errors);
    // } else {
    //   req.flash("error", "Error creating new student.");
    // }
    // res.render("student", {
    //   title: "Add Student",
    //   action: "/students",
    //   submitButtonLabel: "Add",
    //   student: req.body,
    //   subject: subjects,
    //   errors: req.flash("error"),
    // });
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
      action: `/students/${student.id}`,
      submitButtonLabel: "Update",
      student: student,
      subject: student.Subject || [],
    });
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
    if (!student) {
      req.flash("error", "Student not found.");
      return res.redirect("/students");
    }
    
    if (req.body.IsImmunizationAvailable === "true") {
      req.body.IsImmunizationAvailable = true
    }
    else {
      req.body.IsImmunizationAvailable = false
    }
    student.Subject = Array.isArray(req.body.Subject) ? req.body.Subject : [req.body.Subject];    
    Object.assign(student, req.body);
    await student.save();
    res.redirect(`/students`);
  } catch (err) {
    if (err.constructor.name === "ValidationError") {
      parseVErr(err, req);
    } else {
      req.flash("error", "Error updating student.");
    }
    res.render("student", {
      teacher: req.body,
      errors: req.flash("error"),
      title: "Edit Student",
      action: `/students/${req.params.id}`,
      submitButtonLabel: "Update",
      subjects: [], // Pass subjects array or fetch from database
    });
    // res.render("student", { student: req.body, errors: req.flash("error") });
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
