const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isOwner, validateCampground } = require("../middelware");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find().populate("owner");
    res.render("campgrounds/index", { campgrounds });
  }),
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("owner").populate({
      path: "reviews",
      populate: "author",
    });
    console.log(campground);
    if (!campground) {
      req.flash("error", "Campground doesn't exists.");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  }),
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { campground } = req.body;
    const camp = new Campground(campground);
    await camp.save();
    req.flash("success", "Successfuly made a new Campground");
    res.redirect(`/campgrounds/${camp._id}`);
  }),
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  }),
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateCampground,
  catchAsync(async (req, res) => {
    const { campground } = req.body;
    const { id } = req.params;

    await Campground.findByIdAndUpdate(id, { ...campground }, { new: true });
    req.flash("success", "Successfuly edited the Campground");
    res.redirect(`/campgrounds/${id}`);
  }),
);

router.delete(
  "/:id",
  isOwner,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfuly removed the Campground");
    res.redirect(`/campgrounds`);
  }),
);

module.exports = router;
