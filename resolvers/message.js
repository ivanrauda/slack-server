import { requireAuth, requireTeamAccess } from "../permissions";
import { withFilter } from "graphql-subscriptions";
import pubsub from "../pubsub";

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";

export default {
  Subscription: {
    newChannelMessage: {
      subscribe: requireTeamAccess.createResolver(
        withFilter(
          () => {
            return pubsub.asyncIterator(NEW_CHANNEL_MESSAGE);
          },
          (payload, args) => {
            return payload.channelId === args.channelId;
          }
        )
      )
    }
  },
  Message: {
    user: async ({ user, userId }, args, { models }) => {
      if (user) {
        return user;
      }

      return await models.User.findOne(
        { where: { id: userId } },
        { raw: true }
      );
    }
  },
  Query: {
    messages: requireAuth.createResolver(
      async (parent, { channelId }, { models }) => {
        const messages = await models.Message.findAll(
          { order: [["created_at", "ASC"]], where: { channelId } },
          { raw: true }
        );
        console.log(messages);
        return messages;
      }
    )
  },
  Mutation: {
    createMessage: requireAuth.createResolver(
      async (parent, args, { models, user }) => {
        try {
          const message = await models.Message.create({
            ...args,
            userId: user.id
          });

          const asyncFunc = async () => {
            const currentUser = await models.User.findOne({
              where: { id: user.id }
            });

            pubsub.publish(NEW_CHANNEL_MESSAGE, {
              channelId: args.channelId,
              newChannelMessage: {
                ...message.dataValues,
                user: currentUser.dataValues
              }
            });
          };

          asyncFunc();

          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      }
    )
  }
};
