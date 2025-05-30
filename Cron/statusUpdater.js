const cron = require('node-cron');
const db = require('../models');
const Order = db.Order;
const Rental = db.Rental;
const User = db.User;
const Product = db.Product;
const { sendEmail } = require('../services/email.service');

const STATUSES = ['en attente', 'confirmée', 'préparation', 'expédié', 'livré'];
const NOTIFY_BEFORE_DAYS = parseInt(process.env.NOTIFY_BEFORE_DAYS || 6);

/* =========================================================================
   Mise à jour automatique des statuts de commande
   ========================================================================= */
const updateOrderStatuses = async () => {
  try {
    const orders = await Order.findAll({
      where: {
        status: { [db.Sequelize.Op.not]: 'livré' }
      }
    });

    for (const order of orders) {
      const currentIndex = STATUSES.indexOf(order.status);
      if (currentIndex < STATUSES.length - 1) {
        order.status = STATUSES[currentIndex + 1];
        await order.save();

        const user = await order.getUser();

        const subject = `Mise à jour de votre commande #${order.id}`;
        const html = `
          <p>Bonjour ${user.username},</p>
          <p>Votre commande n°${order.id} a été mise à jour au statut suivant :</p>
          <h3>${order.status}</h3>
          <p>Merci pour votre confiance.</p>
        `;

        try {
          await sendEmail(user.email, subject, html);
          console.log(`Email envoyé à ${user.email} pour commande ${order.id}`);
        } catch (err) {
          console.error(`Erreur envoi email pour commande ${order.id}:`, err);
        }

        console.log(`Commande ${order.id} mise à jour au statut : ${order.status}`);
      }
    }
  } catch (error) {
    console.error('Erreur dans la mise à jour des statuts :', error);
  }
};

/* =========================================================================
   Notifications avant fin de location (x jours avant endDate)
   ========================================================================= */
const notifyUpcomingRentals = async () => {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + NOTIFY_BEFORE_DAYS);

  try {
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
      const subject = '⏳ Rappel de fin de location';
      const html = `
        <p>Bonjour ${rental.user.username},</p>
        <p>Votre location pour le produit <strong>${rental.product.name}</strong> se termine le <strong>${rental.endDate}</strong>.</p>
        <p>Merci de penser à le retourner à temps.</p>
        <p>– SeedShop</p>
      `;

      try {
        await sendEmail(rental.user.email, subject, html);
        console.log(`📧 Rappel envoyé à ${rental.user.email}`);
      } catch (err) {
        console.error(`Erreur envoi email de rappel à ${rental.user.email}:`, err);
      }
    }
  } catch (error) {
    console.error('Erreur lors de la recherche des locations à notifier :', error);
  }
};

/* =========================================================================
   Lancement automatique (planification CRON)
   ========================================================================= */
const task = cron.schedule('*/1 * * * *', () => {
  console.log('Lancement de la mise à jour automatique des statuts...');
  updateOrderStatuses();

  console.log('Lancement des notifications de fin de location...');
  notifyUpcomingRentals();
}, {
  scheduled: false
});

module.exports = {
  start: () => task.start(),
  notifyUpcomingRentals // exposé pour test manuel si besoin
};
