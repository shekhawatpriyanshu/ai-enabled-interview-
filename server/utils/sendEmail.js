const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const { email, subject, message } = options;

  // Check if SMTP is configured. If not, log to console for development convenience
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM || "no-reply@interviewplatform.com";

  if (!host || !user || !pass) {
    console.log("-----------------------------------------");
    console.log(`[EMAIL DEV LOG] Sending email to: ${email}`);
    console.log(`[EMAIL DEV LOG] Subject: ${subject}`);
    console.log(`[EMAIL DEV LOG] Message:\n${message}`);
    console.log("-----------------------------------------");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: parseInt(port) || 587,
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from,
    to: email,
    subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
