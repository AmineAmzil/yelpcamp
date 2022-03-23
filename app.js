const express = require("express");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const Campground = require("./models/campground");

const PORT = process.env.PORT;

const app = express();

mongoose.connect(process.env.DBLINK);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { campground } = req.body;
  const { id } = req.params;

  await Campground.findByIdAndUpdate(id, { ...campground }, { new: true });

  res.redirect(`/campgrounds/${id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;

  await Campground.findByIdAndDelete(id);

  res.redirect(`/campgrounds`);
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find();
  res.render("campgrounds/index", { campgrounds });
});

app.post("/campgrounds", async (req, res) => {
  const { campground } = req.body;
  const camp = new Campground(campground);
  await camp.save();
  res.redirect(`/campgrounds/${camp._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show", { campground });
});

app.listen(PORT, () => {
  console.log("LISTENING ON PRT " + PORT);
});
