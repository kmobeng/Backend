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
      throw createError("Unable to create flight", 400);
    }
    res.status(201).json({ status: "success", data: flight });
  } catch (error) {
    next(error);
  }
};

exports.getAllFlights = async (req, res, next) => {
  try {
    const flights = await Flight.find();
    if (!flights) {
      throw createError("Unable to fetch tours", 404);
    }
    res
      .status(200)
      .json({ status: "success", length: flights.length, data: flights });
  } catch (error) {
    next(error);
  }
};

exports.getSingleFlight = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw createError("Invalid flight id", 400);
    }
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      throw createError("No flight found", 404);
    }
    res.status(200).json({ status: "success", data: flight });
  } catch (error) {
    next(error);
  }
};

exports.updateFlight = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw createError("Invalid flight id", 400);
    }
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!flight) {
      throw createError("No flight with that id found", 404);
    }
    res.status(200).json({ status: "success", data: flight });
  } catch (error) {
    next(error);
  }
};

exports.deleteFlight = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw createError("Invalid flight id", 400);
    }
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) {
      throw createError("No flight with that id found", 404);
    }
    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    next(error);
  }
};
