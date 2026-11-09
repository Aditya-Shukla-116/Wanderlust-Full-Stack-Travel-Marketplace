
require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const port = process.env.PORT || 8080;
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");  //routes
const reviewRouter = require("./routes/review.js");  //routes npm install connect-mongo --legacy-peer-deps
const userRouter = require("./routes/user.js");  //routes


app.set("view engine" , "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));//path.join() itself puts the required separator between them.
//So the / is not necessary because path.join() handles the separator.

const dbUrl = process.env.ATLASDB_URL

mongoose.connect(dbUrl)
  .then(() => {
    console.log("MongoDB connected successfully to Atlas!");
    
    //  ONLY start listening to web requests AFTER the DB is ready
    app.listen(port, () => {
         console.log(`Application is fully live and listening on port: ${port}`);
         
  console.log("Database:", mongoose.connection.name);
console.log("Host:", mongoose.connection.host);
    });
  })
  .catch(err => {
    console.log("Database connection failed completely:", err);
  });



// Create a MongoDB-based session store.
// Instead of storing sessions in the server's memory,
// MongoStore will save them inside MongoDB.
const store = MongoStore.create({
    
    // MongoDB connection URL.
    // This is the same MongoDB Atlas URL used to connect
    // our application to the database.
    mongoUrl: dbUrl,

    // Secret used by MongoStore for encrypting/processing
    // sensitive session-store data.
    // Keep this secret private.
    crypto: {
        secret: process.env.SECRET,
    },

    // touchAfter prevents MongoDB from updating the session
    // every time the user makes a request.
    //
    // 24 * 3600 = 24 hours in seconds.
    // So the session will only be updated once within 24 hours
    // unless something important changes.
    touchAfter: 24 * 3600,
});


// Listen for errors from the MongoDB session store.
store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});


// Configure Express sessions.
const sessionOptions = {

    // Tell Express to use MongoDB for storing sessions
    // instead of storing sessions in server memory.
    store,

    // Secret used by express-session to sign the session ID cookie.
    // This should be kept private and stored in .env in production.
    secret: process.env.SECRET,

    // Do not save the session back to MongoDB
    // if nothing has changed.
    resave: false,

    // Do not create/save a session until something
    // actually needs to be stored in it.
    saveUninitialized: true,

    cookie: {

        // The cookie will expire after 7 days.
        // Date.now() gives the current time in milliseconds.
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,

        // Maximum lifetime of the cookie = 7 days.
        maxAge: 7 * 24 * 60 * 60 * 1000,

        // Prevent JavaScript in the browser from accessing
        // the session cookie.
        // This provides protection against some XSS attacks.
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Flash Middleware
app.use((req,res,next)=>{
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
  //  console.log(res.locals.message);
   next();
});
//res.locals.currUser = req.user; ----------------------------------->
// Make the currently logged-in user available to all EJS templates.
// req.user is provided by Passport after it authenticates the user
// and restores the user from the session.
// We store it in res.locals so we can access it directly in EJS
// without passing it manually through every res.render() call.



app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/", userRouter);



//privacy and terms routes
app.get("/privacy", (req, res) => {
    res.render("legals/privacy.ejs");
});

app.get("/terms", (req, res) => {
    res.render("legals/terms.ejs");
});



// Random/unmatched route
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});



//Error Handling Middleware
app.use((err, req,res,next)=>{
  //  let {statusCode = 500  , message = "Something went wrong"} = err;
  // res.status(statusCode).send(message);
  res.render("./listings/error.ejs" ,{err});
});