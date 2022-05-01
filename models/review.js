const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  body: String,
  rating: Number,
});

module.exports = model("Review", reviewSchema);
