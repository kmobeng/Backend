const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Schedule must belong to a user"],
  },
  message: { type: String, required: [true, "message is required"] },
  scheduleTime: {
    type: Date,
    required: [true, "Schedule Time is required"],
    validate: {
      validator: function (el) {
        if (this.isNew) {
          return el > new Date();
        }
        return true;
      },
      message: "Schedule Time should be in the future",
    },
  },
  frequency: {
    type: String,
    enum: ["once", "daily", "weekly", "monthly", "yearly"],
    default: "once",
  },
  status: {
    type: String,
    enum: ["active", "completed", "cancelled"],
    default: "active",
  },
  lastTriggered: Date,
  nextTrigger: Date,
  createdAt: { type: Date, default: Date.now },
});

ScheduleSchema.index({ user: 1 });
ScheduleSchema.index({ status: 1, scheduleTime: 1 });
ScheduleSchema.index({ status: 1, nextTrigger: 1 });

ScheduleSchema.methods.calculateNextTrigger = function (baseTime) {
  if (this.frequency === "once") return null;

  const time = new Date(baseTime || this.lastTriggered || this.scheduleTime);

  switch (this.frequency) {
    case "daily":
      time.setDate(time.getDate() + 1);
      break;
    case "weekly":
      time.setDate(time.getDate() + 7);
      break;
    case "monthly":
      time.setMonth(time.getMonth() + 1);
      break;
    case "yearly":
      time.setFullYear(time.getFullYear() + 1);
      break;
  }
  return time;
};

ScheduleSchema.methods.trigger = function () {
  this.lastTriggered = new Date();

  if (this.frequency === "once") {
    this.status = "completed";
  } else {
    this.nextTrigger = this.calculateNextTrigger();
  }

  return this.save({ validateBeforeSave: false });
};

const Schedule = mongoose.model("Schedule", ScheduleSchema);

module.exports = Schedule;
