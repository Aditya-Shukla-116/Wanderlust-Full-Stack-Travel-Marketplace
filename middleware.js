const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js"); // for joi -- imported


// Authentication Middleware
const isLoggedIn = function(req, res, next) {

    // Passport checks whether the current user is authenticated
    // by checking the login information restored from the session.
    // Returns true if the user is logged in; otherwise, false.
    // console.log(req.path, ".." , req.originalUrl);

    if (!req.isAuthenticated()) {
      // if user logged in nahi hai tab hume redirectUrl ko save karana padega . 

        // Store the URL the user originally wanted to visit.
        // req.originalUrl contains the complete requested path,
        // including query parameters.
        // We store it in the session because the user will be
        // redirected to the login page first. After login, we can
        // redirect them back to their originally requested page.
        req.session.redirectUrl = req.originalUrl;

        // Store a temporary error message in the session.
        req.flash("error", "You must be logged in!");

        // Redirect the unauthenticated user to the login page.
        // return prevents the remaining middleware or route handler
        // from executing for this request.
        return res.redirect("/login");
    }

    // If the user is already authenticated, allow the request
    // to continue to the next middleware or route handler.
    next();
};


// Middleware to make the saved redirect URL available to EJS/routes.
const saveRedirectUrl = (req, res, next) => {

    // Check whether an original URL was saved before login.
    if (req.session.redirectUrl) {
     
        // Copy the saved URL into res.locals so it can be accessed
        // through res.locals.redirectUrl in the next middleware
        // or route handler during this request.
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    else{
        res.locals.redirectUrl = "/listings";
    }

    next();
};



// We use a separate middleware because Passport's login process
// regenerates the session to protect against session fixation attacks.
// Therefore, we save the original URL in res.locals before login,
// so it can still be accessed after the session is regenerated.
// res.locals is available throughout the current request and is
// used to pass the saved URL to the login route handler.

// IMPORTANT:
// Passport regenerates the session during login to prevent a
// session fixation attack.
//
// Why is the session regenerated?
// Before login, the user has an anonymous session. After successful
// login, Passport creates a fresh session with a new session ID.
// This prevents an attacker from reusing a session ID that was
// known or assigned before authentication.
//
// What happens when the session is regenerated?
// 1. A new session ID is generated.
// 2. The old session is replaced by a new authenticated session.
// 3. Existing session data may not automatically carry over.
//
// Therefore, we first copy the original URL from req.session
// into res.locals.redirectUrl using separate middleware.
// res.locals preserves this value during the current request,
// even when Passport regenerates the session.
//
// This allows us to redirect the user to the page they originally
// wanted to visit after successful login.



// Middleware to validate incoming listing data using Joi.
// If validation fails, pass a 400 error to the error-handling middleware.
// If validation succeeds, call next() to continue to the route handler.
let validateSchema = (req, res, next) => {
  const { error } = listingSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",<br>");
    return next(new ExpressError(400, errMsg));
  }
  next();
};


//review validation middleware
// Review validation middleware:
// abortEarly: false allows Joi to return all validation errors instead of stopping at the first one.
// If validation fails, combine all error messages and throw a 400 error.
// If validation succeeds, call next() to continue to the review route.
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body, {
        abortEarly: false
    });

    if (error) {
        const errMsg = error.details
            .map((el) => el.message)
            .join(",<br>");

        throw new ExpressError(400, errMsg);
    }

    next();
};


const isOwner = async function(req,res,next){
    let {id} = req.params;
    let list = await Listing.findById(id);
    if (!list.owner._id.equals(req.user._id)){
    req.flash("error", "You don't have permission!");
    return res.redirect(`/listings/${id}`);
  }

  next();
}

const isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params; // 'id' is listing ID, 'reviewId' is review ID
    let review = await Review.findById(reviewId);
    
    // Check if the current user is the author of the review
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to delete this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};



// Export both middlewares.
module.exports = { isLoggedIn, saveRedirectUrl, isOwner ,isReviewAuthor ,validateSchema, validateReview};