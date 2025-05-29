const cron = require('node-cron');
const db = require('../models');
const Order = db.Order;
const { sendEmail } = require('../services/email.service');

// Statuts dans l’ordre d’évolution
const STATUSES = ['en attente', 'confirmée', 'préparation', 'expédié', 'livré'];

const updateOrderStatuses = async () => {
  try {
    const orders = await Order.findAll({
      where: {
        status: { [db.Sequelize.Op.not]: 'livré' } // uniquement les commandes non livrées
      }
    });

    for (const order of orders) {
      const currentIndex = STATUSES.indexOf(order.status);
      if (currentIndex < STATUSES.length - 1) {
        order.status = STATUSES[currentIndex + 1];
        await order.save();

        // Charger l'utilisateur lié à la commande
        const user = await order.getUser();

        // Préparer l'email
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

// Planification : toutes les minutes (pour démo)
const task = cron.schedule('*/1 * * * *', () => {
  console.log('Lancement de la mise à jour automatique des statuts...');
  updateOrderStatuses();
}, {
  scheduled: false
});

module.exports = task;
