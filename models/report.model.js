// models/report.model.js
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    type: {
      type: DataTypes.ENUM('blog', 'comment'),
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resolved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'reports',
    timestamps: true,
  });

  Report.associate = (models) => {
    Report.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      as: 'reporter',
    });

    Report.belongsTo(models.Blog, {
      foreignKey: 'blogId',
      as: 'blog',
      allowNull: true,
    });

    Report.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      as: 'comment',
      allowNull: true,
    });
  };

  return Report;
};
