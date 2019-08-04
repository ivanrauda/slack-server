import { withFilter } from "graphql-subscriptions";
import { requireAuth, directMessageSubscription } from "../permissions";
import pubsub from "../pubsub";

const NEW_DIRECT_MESSAGE = "NEW_DIRECT_MESSAGE";

export default {
  Subscription: {
    newDirectMessage: {
      subscribe: directMessageSubscription.createResolver(
        withFilter(
          () => {
            return pubsub.asyncIterator(NEW_DIRECT_MESSAGE);
          },
          (payload, args, { user }) => {
            return (
              payload.teamId === args.teamId &&
              ((payload.senderId === user.id &&
                payload.receiverId === args.userId) ||
                (payload.senderId === args.userId &&
                  payload.receiverId === user.id))
            );
          }
        )
      )
    }
  },
  DirectMessage: {
    sender: async ({ sender, senderId }, args, { models }) => {
      if (sender) {
        return sender;
      }

      return await models.User.findOne(
        { where: { id: senderId } },
        { raw: true }
      );
    }
  },
  Query: {
    directMessages: requireAuth.createResolver(
      async (parent, { teamId, otherUserId }, { models, user }) =>
        models.DirectMessage.findAll(
          {
            order: [["created_at", "ASC"]],
            where: {
              teamId,
              [models.sequelize.Op.or]: [
                {
                  [models.sequelize.Op.and]: [
                    { receiverId: otherUserId },
                    { senderId: user.id }
                  ]
                },
                {
                  [models.sequelize.Op.and]: [
                    { receiverId: user.id },
                    { senderId: otherUserId }
                  ]
                }
              ]
            }
          },
          { raw: true }
        )
    )
  },
  Mutation: {
    createDirectMessage: requireAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
          const directMessage = await models.DirectMessage.create({
            ...args,
            senderId: user.id
          });

          pubsub.publish(NEW_DIRECT_MESSAGE, {
            teamId: args.teamId,
            senderId: user.id,
            receiverId: args.receiverId,
            newDirectMessage: {
              ...directMessage.dataValues,
              sender: {
                username: user.username
              }
            }
          });

          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      }
    )
  }
};
