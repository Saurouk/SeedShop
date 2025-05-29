const cron = require('node-cron');
const db = require('../models');
const Order = db.Order;

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
        console.log(`Commande ${order.id} mise à jour au statut : ${order.status}`);
        // Ici tu pourras déclencher notification email plus tard
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
