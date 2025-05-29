module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
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
      type: DataTypes.ENUM('kg', 'pièce', 'litre'),
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
      validate: {
        min: 0.01,  // Prix minimum strictement supérieur à 0
      },
    },
    stockThreshold: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
  }, {
    tableName: 'products',
    timestamps: true,
  });

  // Association avec Category
  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: {
        name: 'categoryId',
        allowNull: false,
      },
      as: 'category',
    });
  };

  return Product;
};
