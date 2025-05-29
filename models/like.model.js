// models/like.model.js
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'likes',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'blogId'],
      },
    ],
  });

  Like.associate = (models) => {
    Like.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Like.belongsTo(models.Blog, { foreignKey: 'blogId', as: 'blog' });
  };

  return Like;
};
