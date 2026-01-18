const express = require("express");
const {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
  topCheap,
  getTourStats,
  getMonthlyPlan,
} = require("../controllers/tours.controller");
const { protect, restrictTo } = require("../controllers/auth.controller");
const reviewRoute = require("../routes/reviewRoutes.route");

const tourRoutes = express.Router();

tourRoutes.use("/:tourId/reviews", reviewRoute);

tourRoutes.get("/top-5-cheap", topCheap);

tourRoutes.get(
  "/monthly-plan/:year",
  protect,
  restrictTo("admin", "lead-guide", "guide"),
  getMonthlyPlan
);

tourRoutes.route("/tour-stats").get(getTourStats);

tourRoutes
  .route("/")
  .get(getAllTours)
  .post(protect, restrictTo("admin", "lead-guide"), createTour);

tourRoutes
  .route("/:id")
  .get(getTour)
  .patch(protect, restrictTo("admin", "lead-guide"), updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

module.exports = tourRoutes;
