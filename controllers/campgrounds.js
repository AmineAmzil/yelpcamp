const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary_config/index");
module.exports.getAllCampgrounds = async (req, res) => {
  const campgrounds = await Campground.find().populate("owner");
  // console.log(campgrounds);
  // res.json(campgrounds);
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
  campground.images = req.files.map((file) => ({ url: file.path, filename: file.filename }));
  campground.owner = req.user._id;
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
  const { id } = req.params;
  // console.log("Updating the Campground");
  // console.log(req.body);
  // console.log("images :");
  // console.log(req.files);
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
  const images = req.files.map((file) => ({ url: file.path, filename: file.filename }));
  campground.images.push(...images);

  if (req.body.deleteImages) {
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    req.body.deleteImages.forEach(async (filename) => {
      await cloudinary.uploader.destroy(filename);
    });
  }

  await campground.save();

  req.flash("success", "Successfuly edited the Campground");
  res.redirect(`/campgrounds/${id}`);
};
module.exports.deleteCampgroundById = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfuly removed the Campground");
  res.redirect(`/campgrounds`);
};
