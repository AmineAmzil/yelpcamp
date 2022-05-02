const Campground = require("../models/campground");

module.exports.getAllCampgrounds = async (req, res) => {
  const campgrounds = await Campground.find().populate("owner");
  res.render("campgrounds/index", { campgrounds });
};

module.exports.getCampgroundById = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate("owner").populate({
    path: "reviews",
    populate: "author",
  });
  // console.log(campground);
  if (!campground) {
    req.flash("error", "Campground doesn't exists.");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.getCampgroundCreationPage = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createNewCampground = async (req, res) => {
  const { campground } = req.body;
  const camp = new Campground(campground);
  await camp.save();
  req.flash("success", "Successfuly made a new Campground");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.getCampgroundEditPage = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampgroundById = async (req, res) => {
  const { campground } = req.body;
  const { id } = req.params;

  await Campground.findByIdAndUpdate(id, { ...campground }, { new: true });
  req.flash("success", "Successfuly edited the Campground");
  res.redirect(`/campgrounds/${id}`);
};
module.exports.deleteCampgroundById = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfuly removed the Campground");
  res.redirect(`/campgrounds`);
};
