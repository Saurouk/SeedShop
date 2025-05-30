// models/rentalOrder.model.js
module.exports = (sequelize, DataTypes) => {
  const RentalOrder = sequelize.define('RentalOrder', {
    status: {
      type: DataTypes.ENUM('en_cours', 'terminée', 'partielle', 'retard'),
      defaultValue: 'en_cours',
    },
    totalLateFee: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    }
  }, {
    tableName: 'rental_orders',
    timestamps: true,
  });

  RentalOrder.associate = models => {
    RentalOrder.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    RentalOrder.hasMany(models.Rental, { foreignKey: 'orderId', as: 'rentals' });
  };

  return RentalOrder;
};
