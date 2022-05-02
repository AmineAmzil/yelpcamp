const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const reviews = require("../controllers/reviews");
const { validateReview, isLoggedIn, isAuthor } = require("../middelware");

// router.get(
//   "/",
//   catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id, { reviews: 1 }).populate("reviews");

//     res.json(campground);
//   }),
// );

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
