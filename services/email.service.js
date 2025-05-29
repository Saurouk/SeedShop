const nodemailer = require('nodemailer');
const emailConfig = require('../config/email.config');

const transporter = nodemailer.createTransport(emailConfig);

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"SeedShop" <${emailConfig.auth.user}>`,
      to,
      subject,
      html,
    });
    console.log(`Email envoyé à ${to}`);
  } catch (error) {
    console.error('Erreur envoi email :', error);
  }
};

module.exports = { sendEmail };
