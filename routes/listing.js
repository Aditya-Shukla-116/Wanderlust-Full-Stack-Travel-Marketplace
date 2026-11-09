const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner, validateSchema} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });




//Routes

 router
.route("/")
.get(wrapAsync(listingController.index))
.post(
  isLoggedIn, // if request is sent from postman or hoppscotch
  upload.single('listing[image]'), //middleware
  validateSchema,
  wrapAsync(listingController.createListing)
);


//new route
router.get("/new", isLoggedIn ,listingController.renderNewForm);

router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  upload.single('listing[image]'), //middleware
  validateSchema,
  isOwner,
  wrapAsync(listingController.updateListing),
)
.delete(
  isLoggedIn, isOwner,
  wrapAsync(listingController.destroyListing));
  



// The session connection:
// 1. User logs in → Passport authenticates the credentials.
// 2. serializeUser() → Stores the user's ID in the session.
// 3. Browser sends the session cookie with subsequent requests.
// 4. deserializeUser() → Retrieves the user from the database.
// 5. req.isAuthenticated() → Checks whether Passport has authenticated the current request.
// In one line: The session helps remember the logged-in user, and req.isAuthenticated() checks that authentication status before allowing access to a protected route.

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
