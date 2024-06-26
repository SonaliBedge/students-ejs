const User = require("../models/User");
const flash = require("express-flash");
const parseVErr = require("../utils/parseValidationErrs");
// const parseVErr = require("../util/parseValidationErrs");

const registerShow = (req, res) => {
  res.render("register");
};

const termsShow = (req, res) => {  
  res.render("terms");
};
const privacyShow = (req, res) => {
  res.render("privacy");
};

const registerDo = async (req, res, next) => {
  // console.log(req.body)

  if(req.body.name === ''){
    req.flash("error", "Please enter your name.");   
    return res.render("register");
  }

  if(req.body.email === ''){
    req.flash("error", "Please enter your email.");   
    return res.redrenderirect("register");
  }

  if(req.body.password === ''){
    req.flash("error", "Please enter password.");   
    return res.render("register");
  }

  if(req.body.password1 === ''){
    req.flash("error", "Please enter comfirm password.");   
    return res.render("register");
  }

  if (req.body.password !== req.body.password1) {    
    req.flash("error", "The passwords entered do not match.");   
    return res.render("register");
    // return res.render("register", { errors: req.flash("errors") });
  }

  try {
    await User.create(req.body);
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      // console.log("same email error");
      req.flash("error", "That email address is already registered.");
    } else {
      return next(e);
    }
    return res.render("register");
  }
  res.redirect("/");
};

const logoff = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};
const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("logon");
};

module.exports = {
  registerShow,
  registerDo,
  logoff,
  logonShow,
  termsShow,
  privacyShow,
 
};
