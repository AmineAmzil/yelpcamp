const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username, password });
      const registredUser = await User.register(user, password);
      req.login(registredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome");
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  }),
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
  req.flash("success", "Welcome back");
  const redirectTo = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectTo);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Good bye");
  res.redirect("/");
});

module.exports = router;
