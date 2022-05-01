const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schemas");
const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    // console.log(msg);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    console.log(msg);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.owner._id.equals(req.user._id)) {
    req.flash("error", "You are not allowed to edit this page.");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author._id.equals(req.user._id)) {
    req.flash("error", "You are not allowed to edit this page.");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be loged in first.");
    return res.redirect("/login");
  }
  next();
};
