const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

const passport = require("passport");
const users = require("../controllers/users");

router.route("/register").get(users.getRegistrationPage).post(catchAsync(users.createUser));

router
  .route("/login")
  .get(users.getLoginPage)
  .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.userLogin);

router.get("/logout", users.userLogOut);

module.exports = router;
