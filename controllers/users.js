const User = require("../models/user");

module.exports.getRegistrationPage = (req, res) => {
  res.render("users/register");
};

module.exports.getLoginPage = (req, res) => {
  res.render("users/login");
};

module.exports.createUser = async (req, res) => {
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
};

module.exports.userLogin = (req, res) => {
  req.flash("success", "Welcome back");
  const redirectTo = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectTo);
};

module.exports.userLogOut = (req, res) => {
  req.logout();
  req.flash("success", "Good bye");
  res.redirect("/");
};
