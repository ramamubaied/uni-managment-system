const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'Gmail' or 'SMTP'
  auth: {
    user: 'waleedmansson@gmail.com',
    pass: 'qblczvvvbxecpndv',
  },
});

module.exports = transporter;
// Sorry for the email name I mixed between Waleed and Usman