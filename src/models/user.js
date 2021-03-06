import bcrypt from "bcrypt";

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isAlphanumeric: {
            args: true,
            msg: "The username contains letters and numbers only!"
          },
          len: {
            args: [3, 25],
            msg: "The username needs to be between 3 and 25 characters long!"
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        unique: false,
        validate: {
          isEmail: {
            args: true,
            msg: "Invalid email!"
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [6, 100],
            msg: "The password needs to be between 6 and 100 characters long!"
          }
        }
      }
    },
    {
      hooks: {
        afterValidate: async user => {
          const hashedPassword = await bcrypt.hash(user.password, 12);
          // eslint-disable next line (require-atomic-updates: 0)
          user.password = hashedPassword;
        }
      }
    },
    sequelize
  );

  User.associate = models => {
    User.belongsToMany(models.Team, {
      through: models.Member,
      foreignKey: {
        name: "userId",
        field: "user_id"
      }
    });

    User.belongsToMany(models.Channel, {
      through: "channel_member",
      foreignKey: {
        name: "userId",
        field: "user_id"
      }
    });

    User.belongsToMany(models.Channel, {
      through: models.PrivateMembers,
      foreignKey: {
        name: "userId",
        field: "user_id"
      }
    });
  };

  return User;
};
