import lod from 'lodash';
import { tryLogin } from './auth';

const formatErrors = (e, models) => {
  if (e instanceof models.sequelize.ValidateError) {
    return e.errors.map((x) => lod.pick(x, ['path', 'message']));
  }
  return [{
    path: 'name',
    message: 'something went wrong',
  }];
};

export default {
  Query: {
    getUser: (_, { id }, { models }) => models.User.findOne({ where: { id } }),

    allUsers: (_, args, { models }) => models.User.findAll(),

    allTeams: async (_, args, { models, currentUser }) => {
      const userTeam = await models.Team.findAll({
        where: { owner: currentUser.id },
      }, { raw: true });
      return userTeam;
    },

    getCurrentUser: async (_, args, { models, currentUser }) => {
      if (!currentUser) {
        return null;
      }
      const user = await models.User.findOne({
        where: {
          username: currentUser.username,
        },
      });
      return user;
    },
  },

  Mutation: {
    register: async (_, args, { models }) => {
      try {
        const user = await models.User.create(args);
        return {
          ok: true,
          user,
        };
      } catch (e) {
        return {
          ok: false,
          errors: formatErrors(e, models),
        };
      }
    },

    login: async (_, { email, password }, { models, SECRET, SECRET2 }) => (
      tryLogin(email, password, models, SECRET, SECRET2)
    ),

    createTeam: async (_, args, { models, currentUser }) => {
      try {
        const team = await models.Team.create({ ...args, owner: currentUser.id });
        models.Channel.create({ name: 'general', public: true, teamId: team.id });
        return { ok: true };
      } catch (e) {
        return {
          ok: false,
          errors: formatErrors(e, models),
        };
      }
    },

    createChannel: async (_, args, { models }) => {
      try {
        const channel = await models.Channel.create(args);
        return { ok: true, channel };
      } catch (e) {
        return {
          ok: false,
          errors: formatErrors(e, models),
        };
      }
    },

    createMessage: async (_, args, { models, user }) => {
      try {
        await models.Message.create({
          ...args,
          userId: user.id,
        });
        return true;
      } catch (e) {
        return false;
      }
    },
  },
  Team: {
    channels: ({ id }, args, { models }) => models.Channel.findAll({ where: { teamId: id } }),
  },
};
