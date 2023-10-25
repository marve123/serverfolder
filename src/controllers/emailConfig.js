const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');

const auth = {
  auth: {
    api_key: 'YOUR_MAILGUN_API_KEY',
    domain: 'YOUR_MAILGUN_DOMAIN',
  },
};

const transporter = nodemailer.createTransport(mailgunTransport(auth));

module.exports = transporter;
