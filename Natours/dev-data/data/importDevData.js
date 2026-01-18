const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Tour = require("../../model/tour.model");
const User = require("../../model/user.model");
const Review = require("../../model/review.model");

dotenv.config();

const DB = process.env.DB_URL.replace("PASSWORD", process.env.DB_PASSWORD);
mongoose
  .connect(DB)
  .then(() => console.log("database connected successfully"))
  .catch(() => console.log("error when connecting database", error));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("data successfully loaded");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("data deleted successfully");
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
