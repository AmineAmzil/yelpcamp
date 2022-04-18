const express = require("express");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const { campgroundSchema, reviewSchema } = require("./schemas");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/review");
const Campground = require("./models/campground");
const campgroundsRouter = require("./routes/campgroundsRouter");
const reviewsRouter = require("./routes/reviewsRouter");
const PORT = process.env.PORT;
const session = require("express-session");
const flash = require("connect-flash");
const app = express();

mongoose.connect(process.env.DBLINK);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionConfig = {
  secret: "bettersecret key should be here",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session(sessionConfig));

app.use(express.static(path.join(__dirname, "public")));

// Routes

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/campgrounds", campgroundsRouter);
app.use("/campgrounds/:id/reviews", reviewsRouter);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((error, req, res, next) => {
  const { statusCode = 500 } = error;
  if (!error.message) error.message = "Oh no somthing went wrong";
  req.flash("error", "Somthing went wrong");
  res.redirect("/campgrounds");
  // res.status(statusCode).render("error", { error });
});

app.listen(PORT, () => {
  console.log("LISTENING ON PRT " + PORT);
});
