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
    
    // let redirectUrl = res.locals.redirectUrl || "/listings" ;
    //maine saveRedirectUrl ke middleware me hi insert krdiya as else condition
    //iska karan simple hai agar hum direct login  dabake page se login krne ka try karenge to isloggedin to trigger hi nhi hoga kyuki vo create, update,edit in sab route pe hai as midleware so yha pe agar hum res.redirect(req.locals.redirectUrl) kre to redirectUrl empty hai and it will show that page is not found so thats why we arechecking if redirectUrl is there or else it will redirect to /listings. 
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