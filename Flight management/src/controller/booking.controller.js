const Booking = require("../models/booking.model");
const Flight = require("../models/flight.model");
const { createError } = require("../utils/flight.util");
const mongoose = require("mongoose");
const logger = require("../config/logger.config");

exports.createBooking = async (req, res, next) => {
  try {
    const { flightNumber } = req.body;

    const flight = await Flight.findOne({ flightNumber });

    if (!flight) {
      logger.warn("Booking failed: flight not found", {
        userId: req.user._id,
        flightNumber,
      });
      throw createError("There is no flight with that number", 404);
    }

    if (flight.availableSeats < 1) {
      logger.warn("Booking failed: no seats available", {
        userId: req.user._id,
        flightNumber,
        flightId: flight._id,
      });
      throw createError("Sorry there are no seats left", 400);
    }

    const booking = await Booking.create({
      user: req.user._id,
      flight: flight._id,
    });

    flight.availableSeats--;
    await flight.save();
    await booking.populate("flight");

    logger.info("Booking created successfully", {
      bookingId: booking._id,
      userId: req.user._id,
      email: req.user.email,
      flightNumber,
      flightId: flight._id,
      remainingSeats: flight.availableSeats,
    });

    res.status(201).json({ status: "success", data: booking });
  } catch (error) {
    logger.error("Booking creation failed", {
      userId: req.user?._id,
      email: req.user?.email,
      flightNumber: req.body.flightNumber,
      error: error.message,
    });
    next(error);
  }
};

exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate("flight");

    logger.info("Bookings retrieved successfully", {
      count: bookings.length,
      userId: req.user?._id,
    });

    res
      .status(200)
      .json({ status: "success", length: bookings.length, data: bookings });
  } catch (error) {
    logger.error("Failed to fetch bookings", {
      userId: req.user?._id,
      error: error.message,
    });
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id;

    if (!mongoose.isValidObjectId(bookingId)) {
      logger.warn("Cancellation failed: invalid booking ID", {
        bookingId,
        userId: req.user?._id,
      });
      throw createError("Invalid id", 400);
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      logger.warn("Cancellation failed: booking not found", {
        bookingId,
        userId: req.user?._id,
      });
      throw createError("No booking found with this ID", 404);
    }

    if (booking.status === "cancelled") {
      logger.warn("Cancellation failed: already cancelled", {
        bookingId,
        userId: req.user?._id,
      });
      throw createError("Booking has already been canceled", 400);
    }

    const flight = await Flight.findById(booking.flight);
    flight.availableSeats++;
    await flight.save();

    booking.status = "cancelled";
    await booking.save();
    await booking.populate("flight");

    logger.info("Booking cancelled successfully", {
      bookingId: booking._id,
      userId: req.user?._id,
      email: req.user?.email,
      flightId: flight._id,
      flightNumber: flight.flightNumber,
      newAvailableSeats: flight.availableSeats,
    });

    res.status(200).json({ status: "success", data: booking });
  } catch (error) {
    logger.error("Booking cancellation failed", {
      bookingId: req.params.id,
      userId: req.user?._id,
      error: error.message,
    });
    next(error);
  }
};
