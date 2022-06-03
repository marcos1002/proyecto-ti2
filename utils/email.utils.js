const nodemailer = require('nodemailer');

const {
  EMAIL_SERVICE,
  EMAIL_USER,
  EMAIL_PASSWORD,
  EMAIL_FROM
} = process.env;

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
});

const sendMail = async ({ to, subject, text, html, attachments }) => {
  return await transporter.sendMail({ from: EMAIL_FROM, to, subject, text, html, attachments });
};

module.exports = {
  sendMail
};