const db = require('../models');
const nodemailer = require('nodemailer');
const Rental = db.Rental;
const User = db.User;
const Product = db.Product;

const NOTIFY_BEFORE_DAYS = parseInt(process.env.NOTIFY_BEFORE_DAYS || 6);
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const notifyUpcomingRentals = async () => {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + NOTIFY_BEFORE_DAYS);

  const rentals = await Rental.findAll({
    where: {
      status: 'en_cours',
      endDate: targetDate.toISOString().split('T')[0]
    },
    include: [
      { model: User, as: 'user' },
      { model: Product, as: 'product' }
    ]
  });

  for (const rental of rentals) {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: rental.user.email,
      subject: '⏳ Rappel de fin de location',
      text: `Bonjour ${rental.user.username},\n\nVotre location pour le produit "${rental.product.name}" se termine bientôt le ${rental.endDate}.\n\nMerci de penser à le retourner à temps.\n\nSeedShop`
    });

    console.log(`📧 Rappel envoyé à ${rental.user.email}`);
  }
};

module.exports = {
  start: () => {
    const cron = require('node-cron');
    console.log("Lancement des notifications de fin de location...");
    cron.schedule('0 9 * * *', notifyUpcomingRentals); // tous les jours à 9h
  },
  notifyUpcomingRentals // ← ✅ Ajout pour exporter la fonction
};

