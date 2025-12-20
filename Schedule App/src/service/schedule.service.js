const Schedule = require("../models/schedule.model");
const mongoose = require("mongoose");
const { createError } = require("../utils/error.util");
const APIFeatures = require("../utils/APIFeatures.util");

exports.createScheduleService = async (
  message,
  scheduleTime,
  frequency,
  userId
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw createError("Invalid user Id", 400);
    }

    if (scheduleTime <= new Date()) {
      throw createError("Schedule time must be in the future", 400);
    }

    const schedule = await Schedule.create({
      message,
      scheduleTime,
      frequency,
      user: userId,
    });

    return schedule;
  } catch (error) {
    throw error;
  }
};

exports.getAllSchedulesService = async (userId, queryString) => {
  try {
    const features = new APIFeatures(
      Schedule.find({ user: userId }),
      queryString
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const schedules = await features.query;
    if (!schedules) {
      throw createError("Error while fetching all schedules", 400);
    }
    return schedules;
  } catch (error) {
    throw error;
  }
};

exports.getSingleScheduleService = async (userId, scheduleId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
      throw createError("Invalid schedule Id", 400);
    }
    const schedule = await Schedule.findOne({ user: userId, _id: scheduleId });
    if (!schedule) {
      throw createError("Error while fetchng single schedule", 400);
    }
    return schedule;
  } catch (error) {
    throw error;
  }
};

exports.updateScheduleService = async (
  userId,
  scheduleId,
  message,
  scheduleTime,
  frequency,
  status
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
      throw createError("Invalid schedule Id", 400);
    }

    const schedule = await Schedule.findOneAndUpdate(
      { user: userId, _id: scheduleId },
      { message, scheduleTime, frequency, status },
      { new: true, runValidators: true }
    );

    if (!schedule) {
      throw createError("Error while updating the schedule");
    }
    return schedule;
  } catch (error) {
    throw error;
  }
};

exports.deleteScheduleService = async (userId, scheduleId) => {
  try {
    const schedule = await Schedule.findOneAndDelete({
      user: userId,
      _id: scheduleId,
    });
    return schedule;
  } catch (error) {
    throw error;
  }
};
