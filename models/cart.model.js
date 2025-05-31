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
    specialOfferId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Peut être nul s’il n’y a pas d’offre
    },
    discountAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    discountedPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  }, {
    tableName: 'carts',
    timestamps: true,
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Cart.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });

    Cart.belongsTo(models.SpecialOffer, {
      foreignKey: 'specialOfferId',
      as: 'specialOffer'
    });
  };

  return Cart;
};
