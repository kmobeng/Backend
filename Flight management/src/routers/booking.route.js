const { Router } = require("express");
const {
  createBooking,
  getBookings,
  cancelBooking,
} = require("../controller/booking.controller");
const { protect } = require("../controller/auth.controller");

const router = Router();

router.route("/").post(protect, createBooking).get(protect, getBookings);

router.route("/:id").delete(protect, cancelBooking);

module.exports = router;
