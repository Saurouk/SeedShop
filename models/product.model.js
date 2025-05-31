// models/product.model.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      /* --- Infos générales --- */
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      symbol: {
        type: DataTypes.ENUM('kg', 'pièce', 'litre', 'unité'),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
      },
      gallery: {
        type: DataTypes.JSON,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0.01 },
      },
      stockThreshold: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
      },

      /* --- Champs pour la location --- */
      isRentable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,           // non-louable par défaut
      },
      dailyRate: {
        type: DataTypes.FLOAT,
        allowNull: true,               // requis seulement si isRentable = true
        validate: { min: 0.01 },
      },
    },
    {
      tableName: 'products',
      timestamps: true,
    }
  );

  /* --- Associations --- */
  Product.associate = (models) => {
    /* Catégorie */
    Product.belongsTo(models.Category, {
      foreignKey: { name: 'categoryId', allowNull: false },
      as: 'category',
    });

    /* ⇾ Locations  (permet le include { model: Product, as: 'product' } côté Rental) */
    Product.hasMany(models.Rental, {
      foreignKey: 'productId',
      as: 'rentals',
    });

    /* ⇾ Offres spéciales */
    Product.belongsToMany(models.SpecialOffer, {
      through: 'SpecialOfferProduct',
      foreignKey: 'productId',
      otherKey: 'specialOfferId',
      as: 'specialOffers',
    });
  };

  return Product;
};
