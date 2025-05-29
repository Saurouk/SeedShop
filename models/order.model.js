// models/order.model.js
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    status: {
      type: DataTypes.ENUM('en attente', 'confirmée', 'préparation', 'expédié', 'livré'),
      defaultValue: 'en attente',
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    // Tu peux ajouter d'autres infos comme adresse, méthode paiement, etc.
  }, {
    tableName: 'orders',
    timestamps: true,
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
  };

  return Order;
};
