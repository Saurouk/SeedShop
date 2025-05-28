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
    category: {
      type: DataTypes.STRING,
      allowNull: false,
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
    stockThreshold: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
  }, {
    tableName: 'products',
    timestamps: true,
  });

  return Product;
};
