// models/newsletter.model.js
module.exports = (sequelize, DataTypes) => {
  const Newsletter = sequelize.define('Newsletter', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'newsletters',
    timestamps: true
  });

  return Newsletter;
};
