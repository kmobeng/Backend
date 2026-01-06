const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: process.env.EMAIL_PORT,
    secure: false,
  });

  const mailOptions = {
    from: "Top Schedule <noreply@topschedule.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
