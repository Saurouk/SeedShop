// models/rental.model.js
module.exports = (sequelize, DataTypes) => {
  const Rental = sequelize.define('Rental', {
    startDate:  { type: DataTypes.DATEONLY, allowNull: false },
    endDate:    { type: DataTypes.DATEONLY, allowNull: false },
    status:     { type: DataTypes.ENUM('en_cours', 'terminée', 'retard'), defaultValue: 'en_cours' },
    lateFee:    { type: DataTypes.FLOAT, defaultValue: 0 },
    quantityBeforeRental: { type: DataTypes.INTEGER, allowNull: true }, 
  }, {
    tableName: 'rentals',
    timestamps: true,
  });

  Rental.associate = models => {
    Rental.belongsTo(models.User,         { foreignKey: 'userId',    as: 'user' });
    Rental.belongsTo(models.Product,      { foreignKey: 'productId', as: 'product' });
    Rental.belongsTo(models.RentalOrder,  { foreignKey: 'orderId',   as: 'order' }); // ← AJOUT ICI
  };

  return Rental;
};
