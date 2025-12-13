const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Booking must have a user"],
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight",
    required: [true, "Booking must have a flight"],
  },
  status: { type: String, default: "booked", enum: ["booked", "cancelled"] },
  bookingDate: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
