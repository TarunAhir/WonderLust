if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session"); // session-express
const MongoStore = require("connect-mongo");
const flash = require("connect-flash"); 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js"); // FIXED - Added this import

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));


const bdUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl :bdUrl,
    crypto : {
        secret :  process.env.SECRET,
    },
    touchAfter : 23 * 3600,
});

store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE ", error);
});

const sessionOption = {
    store, 
    secret: process.env.SECRET, // session-express
    resave: false, // ||
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize()); // Use passport exset After session
app.use(passport.session()); // again again not login
passport.use(new LocalStrategy(User.authenticate())); // pass User model
passport.serializeUser(User.serializeUser()); // store aboute user info in session mean serei..
passport.deserializeUser(User.deserializeUser()); // Destore aboute user info in session mean Deserei.. logout

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use((req, res, next) => {
    res.locals.success = req.flash("success"); // message for success
    res.locals.error = req.flash("error"); // aa badhi vastu html ma access kari sakiye
    res.locals.currUser = req.user;
    next();
});


app.get("/", (req, res) => {
    res.redirect("/listings"); // FIXED - Redirect to listings instead of "working"
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);







main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });


    async function main() {
    await mongoose.connect(bdUrl);
}

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found! "));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080, (req, res) => {
    console.log("port is runnig on 8080");
});