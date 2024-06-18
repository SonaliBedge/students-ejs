const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  logonShow,
  registerShow,
  registerDo,
  logoff,
  termsShow,
  privacyShow,
  // studentsData,
  // teachersData,
} = require("../controllers/sessionController");

router.route("/register").get(registerShow).post(registerDo);
router
  .route("/logon")
  .get(logonShow)
  .post(
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/sessions/logon",
      failureFlash: true,
    }),
    (req, res) => {
      // CSRF token refresh
      csrf.refresh(req, res); // Refresh CSRF token

      // Redirect to the success route
      res.redirect("/");
    }
    // (req, res) => {
    //   res.send("Not yet implemented.");
    // }
  );
router.route("/logoff").post(logoff);
router.route("/terms").get(termsShow).post(termsShow);
router.route("/privacy").get(privacyShow).post(privacyShow);
// router.route("/students").get(studentsData).post(studentsData);
// router.route("/teachers").get(teachersData).post(teachersData);
// termsShow,
// privacyShow,
module.exports = router;
