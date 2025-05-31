// models/message.model.js
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    subject: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    attachmentUrl: { type: DataTypes.STRING, allowNull: true }, // pour PDF ou autre fichier
    read: { type: DataTypes.BOOLEAN, defaultValue: false },

    // Champs pour messages envoyés par des visiteurs non inscrits
    visitorName: { type: DataTypes.STRING, allowNull: true },
    visitorEmail: { type: DataTypes.STRING, allowNull: true },
  }, {
    tableName: 'messages',
    timestamps: true,
  });

  Message.associate = models => {
    Message.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
    Message.belongsTo(models.User, { foreignKey: 'receiverId', as: 'receiver' });
  };

  return Message;
};
