const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport(smtpTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
  }));

  // 2) Define the email options
  const mailOptions = {
    from: 'Rahul Srivastava <admin1@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;