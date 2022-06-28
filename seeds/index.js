const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
require("dotenv").config();

mongoose.connect(process.env.DBLINK);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
  await Campground.deleteMany();

  for (let i = 0; i < 50; i++) {
    const random10000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      owner: "628f862d6ccbc93808f17712",
      title: `${sample(descriptors)}, ${sample(places)}`,
      images: [{ url: "https://source.unsplash.com/collection/483251", filename: "random" }],
      location: `${cities[random10000].city}, ${cities[random10000].state}`,
      price: price,
      description:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
    });

    await camp.save();
  }
};

seedDb()
  .then(() => {
    return mongoose.connection.close();
  })
  .then(() => {
    console.log("Database connection closed.");
  })
  .catch((err) => {
    console.log("Database connection not closed");
    console.log(err.message);
  });
