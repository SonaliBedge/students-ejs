const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  logonShow,
  registerShow,
  registerDo,
  logoff,
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

module.exports = router;
