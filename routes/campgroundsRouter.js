const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const campgrounds = require("../controllers/campgrounds");
const { isLoggedIn, isOwner, validateCampground } = require("../middelware");
const multer = require("multer");
const { storage } = require("../cloudinary_config");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(campgrounds.getAllCampgrounds))
  .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgrounds.createNewCampground));

router.get("/new", isLoggedIn, campgrounds.getCampgroundCreationPage);

router.get("/:id/edit", isLoggedIn, isOwner, catchAsync(campgrounds.getCampgroundEditPage));

router
  .route("/:id")
  .get(catchAsync(campgrounds.getCampgroundById))
  .put(isLoggedIn, isOwner, upload.array("image"), validateCampground, catchAsync(campgrounds.updateCampgroundById))
  .delete(isOwner, catchAsync(campgrounds.deleteCampgroundById));

module.exports = router;
