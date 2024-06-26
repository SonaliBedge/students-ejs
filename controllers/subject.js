const Subject = require("../models/Subject.js");
const parseVErr = require("../utils/parseValidationErrs.js");

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({
      createdAt: -1,
    });
    res.render("subjects", { subjects });
  } catch (err) {
    req.flash("error", "Error fetching subjects.");
    res.redirect("/subjects");
  }
};

const addNewSubject = (req, res) => {
  res.render("subject", {
    title: "Add Subject",
    action: "/subjects",
    submitButtonLabel: "Add",
    subject: null,
  });
};

const createNewSubject = async (req, res) => {
  try {
    const { SubjectName } = req.body;
    const newSubject = await Subject.create({
      SubjectName,      
      // createdBy: req.user._id,
    });
    res.redirect("/subjects"); // Redirect to the subjects list page or any other page
  } catch (err) {
    console.error("Error creating new subject:", err);
    req.flash("error", "Error creating new subject.");
    res.redirect("/subjects"); // Redirect to an error page or any other page
  }
};

const getSubjectEntry = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      // createdBy: req.user._id,
    });
    res.render("subject", {
      title: "Edit Subject",
      action: `/subjects/${subject.id}`,
      submitButtonLabel: "Update",
      subject: subject,
    });
  } catch (err) {
    req.flash("error", "Error fetching subject.");
    res.redirect("/subjects");
  }
};

const getSubjectData = async (req, res, next) => {
    try {
      const subjects = await Subject.find().sort({
        createdAt: -1,
      });
      res.locals.subjects = subjects;
      next();
    } catch (err) {
      req.flash("error", "Error fetching subjects.");
      res.locals.subjects = [];
      next();
    }
};

const updateSubjectEntry = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      // createdBy: req.user._id,
    });
    if (!subject) {
      req.flash("error", "Subject not found.");
      return res.redirect("/subjects");
    }
    Object.assign(subject, req.body);
    await subject.save();
    res.redirect(`/subjects`);
  } catch (err) {
    if (err.constructor.name === "ValidationError") {
      parseVErr(err, req);
    } else {
      req.flash("error", "Error updating subject.");
    }
    res.render("subject", { subject: req.body, errors: req.flash("error") });
  }
};

const deleteSubject = async (req, res) => {
  try {
    await Subject.findOneAndDelete({
      _id: req.params.id,
      // createdBy: req.user._id,
    });
    res.redirect("/subjects");
  } catch (err) {
    req.flash("error", "Error deleting subject.");
    res.redirect("/subjects");
  }
};

module.exports = {
  getSubjects,
  addNewSubject,
  createNewSubject,
  getSubjectEntry,
  updateSubjectEntry,
  deleteSubject,
  getSubjectData,
};


