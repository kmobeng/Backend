const { Router } = require("express");
const {
  createFlight,
  getAllFlights,
  getSingleFlight,
  updateFlight,
  deleteFlight,
} = require("../controller/flight.controller");
const { protect, restrictTo } = require("../controller/auth.controller");

const router = Router();

router
  .route("/")
  .post(protect, restrictTo(), createFlight)
  .get(protect, getAllFlights);

router
  .route("/:id")
  .get(protect, getSingleFlight)
  .patch(protect, restrictTo(), updateFlight)
  .delete(protect, restrictTo(), deleteFlight);

module.exports = router;
