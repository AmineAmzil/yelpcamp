const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { cloudinary } = require("../cloudinary_config/index");

const campgroundSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  images: [{ url: String, filename: String }],
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

campgroundSchema.post("findOneAndDelete", async (camp) => {
  if (camp) {
    // console.log(`Campground ${camp._id} is deleted.`);
    // console.log({ camp });
    // console.log("Deleting its reviews :");
    await Review.deleteMany({
      _id: {
        $in: camp.reviews,
      },
    });
    // console.log("Deleting its images from Cloud");
    camp.images.forEach((img) => {
      // console.log(img);
      cloudinary.uploader.destroy(img.filename, function (error, result) {
        // console.log(error, result);
      });
    });
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
