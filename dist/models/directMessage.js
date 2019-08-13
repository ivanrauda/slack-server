"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var DirectMessage = sequelize.define("direct_message", {
    text: {
      type: DataTypes.STRING
    }
  });
  DirectMessage.associate = function (models) {
    DirectMessage.belongsTo(models.Team, {
      foreignKey: {
        name: "teamId",
        field: "team_id"
      }
    });

    DirectMessage.belongsTo(models.User, {
      foreignKey: {
        name: "receiverId",
        field: "receiver_id"
      }
    });

    DirectMessage.belongsTo(models.User, {
      foreignKey: {
        name: "senderId",
        field: "sender_id"
      }
    });
  };

  return DirectMessage;
};