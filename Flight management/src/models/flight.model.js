const mongoose = require("mongoose");

const FlightSchema = new mongoose.Schema({
  flightNumber: { type: Number, required: true, unique: true },
  departure: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
});

const Flight = mongoose.model("Flight", FlightSchema);

module.exports = Flight;
