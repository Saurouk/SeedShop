// models/cart.model.js
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
  }, {
    tableName: 'carts',
    timestamps: true,
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Cart.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  };

  return Cart;
};
