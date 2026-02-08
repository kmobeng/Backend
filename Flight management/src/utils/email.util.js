const nodemailer = require("nodemailer");

const Email = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: Number(process.env.EMAIL_PORT),
    secure: false,
  });

  const mailOptions = {
    from: "Photo Vault <noreply@topschedule.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { Email };
