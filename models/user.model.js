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
      unique: { name: 'users_email_unique' },  // ← nom d’index explicite
      validate: { isEmail: true },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM('user', 'superuser', 'admin'),
      defaultValue: 'user',  // ← si aucun rôle n'est fourni
    },
  }, {
    tableName: 'users',
    timestamps: true,
  });

  return User;
};
