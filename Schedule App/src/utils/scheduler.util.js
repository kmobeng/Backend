const cron = require("node-cron");
const Schedule = require("../models/schedule.model");
const sendEmail = require("./email.util");
const logger = require("../config/winston.config");

exports.scheduler = () => {
  cron.schedule("*/10 * * * * *", async () => {
    const now = new Date();
    const pendingSchedules = await Schedule.find({
      status: "active",
      $or: [
        {
          frequency: "once",
          scheduleTime: { $lte: now },
        },
        {
          frequency: { $ne: "once" },
          $or: [
            { nextTrigger: { $lte: now } },
            {
              nextTrigger: { $exists: false },
              scheduleTime: { $lte: now },
            },
          ],
        },
      ],
    }).populate({ path: "user", select: "email" });

    for (const schedule of pendingSchedules) {
      await sendEmail({
        email: schedule.user.email,
        subject: "YOUR REMINDER!",
        message: schedule.message,
      });
      await schedule.trigger();
    }
  });
};
