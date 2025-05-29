module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    reported: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    tableName: 'comments',
    timestamps: true,
  });

  // Associations
  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      as: 'user',
    });

    Comment.belongsTo(models.Blog, {
      foreignKey: {
        name: 'blogId',
        allowNull: false,
      },
      as: 'blog',
    });
  };

  return Comment;
};
