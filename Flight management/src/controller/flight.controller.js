const logger = require("../config/logger.config");
const Flight = require("../models/flight.model");
const { createError } = require("../utils/flight.util");
const mongoose = require("mongoose");

exports.createFlight = async (req, res, next) => {
  try {
    const flight = await Flight.create({
      flightNumber: req.body.flightNumber,
      departure: req.body.departure,
      destination: req.body.destination,
      departureTime: req.body.departureTime,
      arrivalTime: req.body.arrivalTime,
      price: req.body.price,
      availableSeats: req.body.availableSeats,
    });

    if (!flight) {
      logger.error("Flight creation failed", {
        flightNumber: req.body.flightNumber,
      });
      throw createError("Unable to create flight", 400);
    }

    logger.info("Flight created successfully", {
      flightId: flight._id,
      flightNumber: flight.flightNumber,
      route: `${flight.departure} → ${flight.destination}`,
      adminId: req.user?._id,
    });

    res.status(201).json({ status: "success", data: flight });
  } catch (error) {
    logger.error("Flight creation error", {
      flightNumber: req.body.flightNumber,
      error: error.message,
    });
    next(error);
  }
};

exports.getAllFlights = async (req, res, next) => {
  try {
    const flights = await Flight.find();

    if (!flights) {
      logger.warn("No flights found");
      throw createError("Unable to fetch flights", 404);
    }

    logger.info("Flights retrieved successfully", {
      count: flights.length,
      userId: req.user?._id,
    });

    res
      .status(200)
      .json({ status: "success", length: flights.length, data: flights });
  } catch (error) {
    logger.error("Failed to fetch flights", {
      error: error.message,
    });
    next(error);
  }
};

exports.getSingleFlight = async (req, res, next) => {
  try {
    const flightId = req.params.id;

    if (!mongoose.isValidObjectId(flightId)) {
      logger.warn("Invalid flight ID provided", {
        flightId,
        userId: req.user?._id,
      });
      throw createError("Invalid flight id", 400);
    }

    const flight = await Flight.findById(flightId);

    if (!flight) {
      logger.warn("Flight not found", {
        flightId,
        userId: req.user?._id,
      });
      throw createError("No flight found", 404);
    }

    logger.info("Flight retrieved successfully", {
      flightId: flight._id,
      flightNumber: flight.flightNumber,
      userId: req.user?._id,
    });

    res.status(200).json({ status: "success", data: flight });
  } catch (error) {
    logger.error("Failed to fetch flight", {
      flightId: req.params.id,
      error: error.message,
    });
    next(error);
  }
};

exports.updateFlight = async (req, res, next) => {
  try {
    const flightId = req.params.id;

    if (!mongoose.isValidObjectId(flightId)) {
      logger.warn("Invalid flight ID for update", {
        flightId,
        adminId: req.user?._id,
      });
      throw createError("Invalid flight id", 400);
    }

    const flight = await Flight.findByIdAndUpdate(flightId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!flight) {
      logger.warn("Flight not found for update", {
        flightId,
        adminId: req.user?._id,
      });
      throw createError("No flight with that id found", 404);
    }

    logger.info("Flight updated successfully", {
      flightId: flight._id,
      flightNumber: flight.flightNumber,
      updatedFields: Object.keys(req.body),
      adminId: req.user?._id,
    });

    res.status(200).json({ status: "success", data: flight });
  } catch (error) {
    logger.error("Flight update failed", {
      flightId: req.params.id,
      error: error.message,
    });
    next(error);
  }
};

exports.deleteFlight = async (req, res, next) => {
  try {
    const flightId = req.params.id;

    if (!mongoose.isValidObjectId(flightId)) {
      logger.warn("Invalid flight ID for deletion", {
        flightId,
        adminId: req.user?._id,
      });
      throw createError("Invalid flight id", 400);
    }

    const flight = await Flight.findByIdAndDelete(flightId);

    if (!flight) {
      logger.warn("Flight not found for deletion", {
        flightId,
        adminId: req.user?._id,
      });
      throw createError("No flight with that id found", 404);
    }

    logger.info("Flight deleted successfully", {
      flightId: flight._id,
      flightNumber: flight.flightNumber,
      route: `${flight.departure} → ${flight.destination}`,
      adminId: req.user?._id,
    });

    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    logger.error("Flight deletion failed", {
      flightId: req.params.id,
      error: error.message,
    });
    next(error);
  }
};
