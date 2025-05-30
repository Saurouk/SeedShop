// models/user.model.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { name: 'users_email_unique' },
      validate: { isEmail: true },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM('user', 'superuser', 'admin'),
      defaultValue: 'user',
    },

    newsletterOptIn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true, // Active le soft delete via "deletedAt"
  });

  return User;
};
