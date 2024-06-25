const Teacher = require("../models/Teacher.js");
const parseVErr = require("../utils/parseValidationErrs.js");

const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.render("teachers", { teachers });
  } catch (err) {
    req.flash("error", "Error fetching teachers.");
    res.redirect("/teachers");
  }
};

const addNewTeacher = (req, res) => {
  res.render("teacher", {
    title: "Add Teacher",
    action: "/teachers",
    submitButtonLabel: "Add",
    teacher: null,
    subject: [],
  });
};

const createNewTeacher = async (req, res) => {
  try {
    const { TeacherName, TeacherQualification, NoSemesterUnits, Subject } =
      req.body;
      // console.log(req.body)
    const newTeacher = await Teacher.create({
      TeacherName,
      TeacherQualification,
      NoSemesterUnits,
      Subject: Array.isArray(Subject) ? Subject : [Subject], // Ensure Subjects is always an array           
      createdBy: req.user._id,
    });    
    res.redirect("/teachers"); // Redirect to the teachers list page or any other page
  } catch (err) {
    console.error("Error creating new teacher:", err);
    req.flash("error", "Error creating new teacher.");
    res.redirect("/teachers"); // Redirect to an error page or any other page
  }
};

const getTeacherEntry = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!teacher) {
      req.flash("error", "Teacher not found.");
      return res.redirect("/teachers");
    }
    res.render("teacher", {
      title: "Edit Teacher",
      action: `/teachers/${teacher.id}`,
      submitButtonLabel: "Update",
      teacher: teacher,
      subject: teacher.Subject || [],
    });
  } catch (err) {
    req.flash("error", "Error fetching teacher.");
    res.redirect("/teachers");
  }
};

const updateTeacherEntry = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!teacher) {
      req.flash("error", "Teacher not found.");
      return res.redirect("/teachers");
    }
    // Ensure Subjects is always an array
    teacher.Subject = Array.isArray(req.body.Subject) ? req.body.Subject : [req.body.Subject];
    Object.assign(teacher, req.body);    
    await teacher.save();
    res.redirect(`/teachers`);
  } catch (err) {
    if (err.constructor.name === "ValidationError") {
      parseVErr(err, req);
    } else {
      req.flash("error", "Error updating teacher.");
    }
    res.render("teacher", {
      teacher: req.body,
      errors: req.flash("error"),
      title: "Edit Teacher",
      action: `/teachers/${req.params.id}`,
      submitButtonLabel: "Update",
      subjects: [], // Pass subjects array or fetch from database
    });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    await Teacher.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    res.redirect("/teachers");
  } catch (err) {
    req.flash("error", "Error deleting teacher.");
    res.redirect("/teachers");
  }
};

module.exports = {
  getTeachers,
  addNewTeacher,
  createNewTeacher,
  getTeacherEntry,
  updateTeacherEntry,
  deleteTeacher,
};
