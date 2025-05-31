// models/specialOffer.model.js
module.exports = (sequelize, DataTypes) => {
  const SpecialOffer = sequelize.define('SpecialOffer', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    discountType: {
      type: DataTypes.ENUM('bundle', 'percentage', 'fixed'),
      allowNull: false,
    },
    requiredQuantity: DataTypes.INTEGER,
    discountValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    minPurchase: DataTypes.FLOAT,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  }, {
    tableName: 'special_offers',
    timestamps: true,
  });

  SpecialOffer.associate = (models) => {
    SpecialOffer.belongsToMany(models.Product, {
      through: 'SpecialOfferProduct',
      foreignKey: 'specialOfferId',
      otherKey: 'productId',
      as: 'products',
    });
  };

  return SpecialOffer;
};
