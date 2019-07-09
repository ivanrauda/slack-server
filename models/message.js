export default (sequelize, DataTypes) => {
  const Message = sequelize.define("message", {
    text: {
      type: DataTypes.STRING
    }
  });

  Message.associate = models => {
    Message.belongsTo(models.Channel, {
      foreignKey: "channelId"
    });

    Message.belongsTo(models.User, {
      foreignKey: "userId"
    });
  };

  return Message;
};
