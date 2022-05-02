const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const campgrounds = require("../controllers/campgrounds");
const { isLoggedIn, isOwner, validateCampground } = require("../middelware");

router.get("/", catchAsync(campgrounds.getAllCampgrounds));

router.get("/new", isLoggedIn, campgrounds.getCampgroundCreationPage);

router.get("/:id/edit", isLoggedIn, isOwner, catchAsync(campgrounds.getCampgroundEditPage));

router.post("/", isLoggedIn, catchAsync(campgrounds.createNewCampground));

router
  .route("/:id")
  .get(catchAsync(campgrounds.getCampgroundById))
  .put(isLoggedIn, isOwner, validateCampground, catchAsync(campgrounds.updateCampgroundById))
  .delete(isOwner, catchAsync(campgrounds.deleteCampgroundById));

module.exports = router;
