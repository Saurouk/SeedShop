// models/wishlist.model.js
module.exports = (sequelize, DataTypes) => {
  const Wishlist = sequelize.define('Wishlist', {}, {
    tableName: 'wishlists',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['userId', 'productId'], name: 'wishlist_unique_user_product' },
    ],
  });

  Wishlist.associate = (models) => {
    // Many-to-Many côté User / Product
    models.User.belongsToMany(models.Product, {
      through: Wishlist,
      foreignKey: 'userId',
      otherKey: 'productId',
      as: 'wishlist',
    });

    models.Product.belongsToMany(models.User, {
      through: Wishlist,
      foreignKey: 'productId',
      otherKey: 'userId',
      as: 'wishlistedBy',
    });

    // ✅ Associations directes pour les include
    Wishlist.belongsTo(models.User,    { foreignKey: 'userId',    as: 'user'    });
    Wishlist.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  };

  return Wishlist;
};
