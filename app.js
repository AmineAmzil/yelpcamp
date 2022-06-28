require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const campgroundsRouter = require("./routes/campgroundsRouter");
const reviewsRouter = require("./routes/reviewsRouter");
const userRouter = require("./routes/usersRoutes");
const PORT = process.env.PORT;
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

mongoose.connect(process.env.DBLINK);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

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

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session(sessionConfig));

// Passport configuration

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes

// app.get("/fakeuser", async (req, res) => {
//   const user = new User({ email: "fakeuser@gmail.com", username: "fakeuser" });
//   const newUser = await User.register(user, "fakepassword");
//   res.json(newUser);
// });

app.use((req, res, next) => {
  // console.log("Intercepting a request from line 64");
  // console.log(req.user);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRouter);
app.use("/campgrounds", campgroundsRouter);
app.use("/campgrounds/:id/reviews", reviewsRouter);

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
