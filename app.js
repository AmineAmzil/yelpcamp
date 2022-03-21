const express = require("express");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");

const Campground = require("./models/campground");

const PORT = process.env.PORT;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makecampground", async (req, res) => {
  const camp = new Campground({
    title: "Backyard",
    description: "Cheap camping",
  });

  await camp.save();

  res.send(camp);
});

app.listen(PORT, () => {
  console.log("LISTENIN G ON PRT " + PORT);
});
