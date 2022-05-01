const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { validateReview, isLoggedIn, isAuthor } = require("../middelware");

// router.get(
//   "/",
//   catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id, { reviews: 1 }).populate("reviews");

//     res.json(campground);
//   }),
// );

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { review } = req.body;
    const campground = await Campground.findById(id);
    const r = new Review(review);
    r.author = req.user._id;
    campground.reviews.push(r);
    await r.save();
    await campground.save();
    req.flash("success", "Successfuly added a review.");
    res.redirect(`/campgrounds/${id}`);
  }),
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfuly removed the review");
    res.redirect(`/campgrounds/${id}`);
  }),
);

module.exports = router;
