const express = require("express");
const router = express.Router();
const passport = require("passport");
// Import both middlewares from middleware.js.
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(userController.signup);

//login route
router.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedirectUrl,

  // Passport authenticates the user using the Local Strategy.
  // If authentication fails, redirect to /login and display an error flash message.
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
    userController.login
);


// Logout Route
router.get("/logout", userController.logout);
module.exports = router;
