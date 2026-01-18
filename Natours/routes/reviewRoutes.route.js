const { Router } = require("express");
const {
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
} = require("../controllers/reviews.controller");
const { protect, restrictTo } = require("../controllers/auth.controller");

const reviewRoute = Router({ mergeParams: true });

reviewRoute.use(protect);

reviewRoute
  .route("/")
  .post(restrictTo("user"), restrictTo("user"), setTourUserIds, createReview)
  .get(getAllReviews);

reviewRoute
  .route("/:id")
  .get(getReview)
  .delete(restrictTo("user", "admin"), deleteReview)
  .patch(restrictTo("user", "admin"), updateReview);

module.exports = reviewRoute;
