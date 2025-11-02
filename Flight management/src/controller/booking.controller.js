const Booking = require("../models/booking.model");
const Flight = require("../models/flight.model");
const { createError } = require("../utils/flight.util");
const mongoose = require("mongoose");

exports.createBooking = async (req, res, next) => {
  try {
    const { flightNumber } = req.body;
    const flight = await Flight.findOne({ flightNumber });
    if (!flight) {
      throw createError("There is no flight with that number", 404);
    }
    if (flight.availableSeats < 1) {
      throw createError("Sorry there are no seats left", 400);
    }
    const booking = await Booking.create({
      user: req.user._id,
      flight: flight._id,
    });
    flight.availableSeats--;
    await flight.save();
    await booking.populate("flight");
    res.status(201).json({ status: "success", data: booking });
  } catch (error) {
    next(error);
  }
};

exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate("flight");
    res
      .status(201)
      .json({ status: "success", lenght: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw createError("Invalid id", 400);
    }
    const booking = await Booking.findById(req.params.id).populate("flight");
    if (!booking) {
      throw createError("No booking found with this ID", 404);
    }

    booking.flight.availableSeats++;
    booking.status = "cancelled";
    await booking.save();
    // await Booking.findByIdAndDelete(req.params.id);

    res.status(202).json({ status: "success", data: booking });
  } catch (error) {
    next(error);
  }
};
