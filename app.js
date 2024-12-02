if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
console.log(process.env.SECRET);

const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");
// const Review = require("./models/review.js");
// const Listing = require("./models/listing.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const dbUrl = process.env.ATLAS_URL ;

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const mongoose = require('mongoose');

app.use((req, res, next) => {
    res.locals.succMsg = req.flash("success");
    res.locals.delMsg = req.flash("delete");
    res.locals.updMsg = req.flash("update");
    res.locals.addMsg = req.flash("add");
    res.locals.revDelMsg = req.flash("reviewDelete");
    res.locals.singMsg = req.flash("signUp");
    res.locals.errMsg = req.flash("Error");
    res.locals.logMsg = req.flash("logIN");
    res.locals.error = req.flash("error");
    res.locals.logErr = req.flash("logErr");
    res.locals.currUser = req.user;
    next();
})

const listings = require("./routes/listings.js");
app.use("/listings", listings);

const reviews = require("./routes/review.js");
app.use("/listings/:id/review", reviews);

const userSignUp = require("./routes/userSignUp.js");
app.use("/signup", userSignUp);

const userLogin = require("./routes/userLogin.js");
app.use("/login", userLogin);

const userLogout = require("./routes/userLogout.js");
app.use("/logout", userLogout);

main()
.then(() => {
    console.log("connected to db!");
})
.catch(err => console.log(err));

let port = 3000;

app.listen(port, () => {
    console.log("server is connected to port: 3000");
})

app.get("/", (req, res) => {
    res.send("server is runnig");
})

// standard error give when nothing will match it will give ||

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
    console.log(err);
    let {statusCode=500, message="something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
})