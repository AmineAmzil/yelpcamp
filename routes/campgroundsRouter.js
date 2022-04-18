const express = require("express");
const router = express.Router();
const { campgroundSchema, reviewSchema } = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    console.log(msg);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
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
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  }),
);

router.put(
  "/:id",
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
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfuly removed the Campground");
    res.redirect(`/campgrounds`);
  }),
);

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    res.render("campgrounds/index", { campgrounds });
  }),
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    if (!campground) {
      req.flash("error", "Campground doesn't exists.");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  }),
);

module.exports = router;
