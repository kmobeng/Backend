const {
  createScheduleService,
  getAllSchedulesService,
  getSingleScheduleService,
  updateScheduleService,
  deleteScheduleService,
} = require("../service/schedule.service");
const logger = require("../config/winston.config");
const { createError } = require("../utils/error.util");

exports.createSchedule = async (req, res, next) => {
  try {
    let { message, scheduleTime, frequency } = req.body;
    if (!frequency) frequency = "once";
    const userId = req.user._id;
    logger.info("Creating a schedule", {
      frequency,
      message,
      userId: req.user._id,
      scheduleTime,
    });
    const schedule = await createScheduleService(
      message,
      new Date(scheduleTime),
      frequency,
      userId
    );

    logger.info("schedule created successfully", {
      frequency,
      message,
      userId: req.user._id,
      scheduleTime,
    });
    res.status(201).json({ status: "success", data: { schedule } });
  } catch (error) {
    logger.error("Error while creating schedule", {
      error: error.message,
      stack: error.stack,
      name: req.body.name,
      email: req.body.email,
    });
    next(error);
  }
};

exports.getAllSchedules = async (req, res, next) => {
  try {
    logger.info("Fetching all schedules", {
      userId: req.user._id,
      email: req.user.email,
    });
    const schedules = await getAllSchedulesService(req.user._id, req.query);

    if (schedules.length === 0)
      return res.status(200).json({ message: "No schedule found" });

    logger.info("schedules fetched successfully", {
      userId: req.user._id,
      email: req.user.email,
    });
    res.status(200).json({
      status: "success",
      result: schedules.length,
      data: { schedules },
    });
  } catch (error) {
    logger.error("Error while fetching schedules", {
      error: error.message,
      stack: error.stack,
      userId: req.user._id,
      email: req.user.email,
    });
    next(error);
  }
};

exports.getSingleSchedule = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    if (!scheduleId) {
      throw createError("No scheduleId provided", 400);
    }
    logger.info("getting single schedule", {
      userId: req.user._id,
      scheduleId: scheduleId,
    });
    const schedule = await getSingleScheduleService(req.user._id, scheduleId);
    if (schedule.length === 0)
      return res.status(200).json({ message: "No schedule found" });

    logger.info("schedules fetched successfully", {
      userId: req.user._id,
      scheduleId: scheduleId,
    });
    res.status(200).json({ status: "success", data: { schedule } });
  } catch (error) {
    logger.error("Error while fetching schedule", {
      error: error.message,
      stack: error.stack,
      userId: req.user._id,
      email: req.user.email,
      scheduleId: req.params?.scheduleId,
    });
    next(error);
  }
};

exports.updateSchedule = async (req, res, next) => {
  try {
    const { message, scheduleTime, status, frequency } = req.body;
    if (status === "completed") {
      throw createError("You can't change the status to completed", 400);
    }
    const { scheduleId } = req.params;

    logger.info("Updating schedule", {
      userId: req.user._id,
      scheduleId,
      reqBody: req.body,
    });

    const schedule = await updateScheduleService(
      req.user._id,
      scheduleId,
      message,
      scheduleTime,
      frequency,
      status
    );

    if (frequency && frequency !== "once") {
      if (scheduleTime) {
        schedule.nextTrigger = undefined;
        schedule.status = "active";
      } else if (schedule.scheduleTime <= new Date()) {
        schedule.nextTrigger = schedule.calculateNextTrigger(new Date());
        schedule.status = "active";
      }
      await schedule.save({ validateBeforeSave: false });
    }

    if (frequency === "once") {
      schedule.nextTrigger = undefined;
      schedule.status = "active";

      await schedule.save({ validateBeforeSave: false });
    }

    logger.info("Updated schedule successfully", {
      userId: req.user._id,
      scheduleId,
      reqBody: req.body,
    });
    res.status(200).json({ status: "success", data: { schedule } });
  } catch (error) {
    logger.error("Error while updating schedule", {
      error: error.message,
      stack: error.stack,
      userId: req.user._id,
      email: req.user.email,
      scheduleId: req.params?.scheduleId,
      reqBody: req.body,
    });
    next(error);
  }
};

exports.deleteSchedule = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;

    logger.info("Deleting schedule", { scheduleId, userId: req.user._id });

    const schedule = await deleteScheduleService(req.user._id, scheduleId);

    logger.info("Deletd schedule successfully", {
      scheduleId,
      userId: req.user._id,
    });

    res.status(200).json({ status: "success" });
  } catch (error) {
    logger.error("Error while deleting schedule", {
      error: error.message,
      stack: error.stack,
      userId: req.user._id,
      email: req.user.email,
      scheduleId: req.params?.scheduleId,
      reqBody: req.body,
    });
    next(error);
  }
};
