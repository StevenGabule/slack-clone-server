import ld from 'lodash';
import { tryLogin } from './auth';

const formatErrors = (e, models) => {
  if (e instanceof models.sequelize.ValidateError) {
    return e.errors.map((x) => ld.pick(x, ['path', 'message']));
  }
  return [{ path: 'name', message: 'something went wrong' }];
};

export default {
  Query: {
    getUser: (_, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (_, args, { models }) => models.User.findAll(),
    hi: () => 'asdasd',
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

    createTeam: async (_, args, { models, user }) => {
      try {
        console.log('user: ', user);
        await models.Team.create({ ...args, owner: user.id });
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
        await models.Channel.create(args);
        return true;
      } catch (e) {
        return false;
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
};
