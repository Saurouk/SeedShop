// models/specialOfferProduct.model.js
module.exports = (sequelize, DataTypes) => {
  const SpecialOfferProduct = sequelize.define('SpecialOfferProduct', {
    specialOfferId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'special_offer_products',
    timestamps: false,
  });

  return SpecialOfferProduct;
};
