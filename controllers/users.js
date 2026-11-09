const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};



module.exports.signup = async (req, res,next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    // Log in the newly registered user automatically after successful signup.
    // req.login() is a Passport method that establishes the user's login session.
    // It serializes the user's information and stores it in the session.
    req.login(registeredUser, (err) => {

    // If Passport encounters an error while logging in,
    // pass the error to the next error-handling middleware.
    if (err) {
        return next(err);
    }

    // Store a one-time success message in the session using connect-flash.
    req.flash("success", "Welcome to Wanderlust!");

    // Redirect the user to the listings page after successful login.
    res.redirect("/listings");
});
}

catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};


module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};


module.exports.login = async (req, res) => {
    // If login is successful, display a success flash message.
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl ;
    
// let redirectUrl = res.locals.redirectUrl || "/listings";
// I added this directly as an else condition inside the saveRedirectUrl middleware.
//
// The reason is simple: if we click Login directly from a page and try to log in,
// the isLoggedIn middleware will not be triggered because it is only applied
// to protected routes like create, update, edit, etc.
//
// So, if we use res.redirect(req.locals.redirectUrl) here,
// redirectUrl will be empty, and it will show "Page Not Found".
//
// That's why we are checking whether redirectUrl exists or not.
// If redirectUrl exists, we redirect the user to that page.
// Otherwise, we redirect the user to /listings.
//
// Redirect the authenticated user to the page.
    res.redirect(redirectUrl);
  };


  module.exports.logout = (req, res, next) => {
  // Passport's req.logout() removes the authenticated user
  // from the current session and logs the user out.

  req.logout((err) => {
    // If any error occurs during logout,
    // forward it to the global error-handling middleware.
    if (err) {
      return next(err);
    }
    // Store a success message temporarily in the session.
    req.flash("success", "You are logged out!");
   // Redirect the user to the listings page.
    res.redirect("/listings");
  });
};