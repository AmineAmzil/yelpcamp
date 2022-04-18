const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const Review = require("../models/review");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    console.log(msg);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id, { reviews: 1 }).populate("reviews");

    res.json(campground);
  }),
);

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { review } = req.body;
    const campground = await Campground.findById(id);
    const r = new Review(review);
    campground.reviews.push(r);
    await r.save();
    await campground.save();
    req.flash("success", "Successfuly added a review.");
    res.redirect(`/campgrounds/${id}`);
  }),
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfuly removed the review");
    res.redirect(`/campgrounds/${id}`);
  }),
);

module.exports = router;
