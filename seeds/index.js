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
    const camp = new Campground({
      title: `${sample(descriptors)}, ${sample(places)}`,
      location: `${cities[random10000].city}, ${cities[random10000].state}`,
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
