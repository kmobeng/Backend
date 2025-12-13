const { Router } = require("express");
const { protect } = require("../controller/auth.controller");
const {
  createSchedule,
  getAllSchedules,
  getSingleSchedule,
  updateSchedule,
  deleteSchedule,
} = require("../controller/schedule.controller");

const scheduleRoute = Router();

scheduleRoute
  .route("/")
  .post(protect, createSchedule)
  .get(protect, getAllSchedules);

scheduleRoute
  .route("/:scheduleId")
  .get(protect, getSingleSchedule)
  .patch(protect, updateSchedule)
  .delete(protect, deleteSchedule);

module.exports = scheduleRoute;
