// models/wishlist.model.js
module.exports = (sequelize, DataTypes) => {
  const Wishlist = sequelize.define('Wishlist', {}, {
    tableName: 'wishlists',
    timestamps: true,          
    indexes: [
      { unique: true, fields: ['userId', 'productId'] } // empêche les doublons
    ],
  });

  // Associations Many-to-Many User ⇄ Product via Wishlist
  Wishlist.associate = (models) => {
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
  };

  return Wishlist;
};
