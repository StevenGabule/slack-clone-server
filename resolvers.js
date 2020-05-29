import bcrypt from 'bcrypt';
import lod from 'lodash';


const formatErr = (e, models) => {
  if (e instanceof models.Sequelize.ValidationError) {
    return e.errors.map((x) => lod.pick(x, ['path', 'message']));
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
    register: async (_, { password, ...otherArgs }, { models }) => {
      try {
        if (password.length < 5 || password.length > 100) {
          return {
            ok: false,
            errors: [{ path: 'password', message: 'The password needs to be 5 and 100 characters long' }],
          };
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await models.User.create({ ...otherArgs, password: hashedPassword });
        return {
          ok: true,
          user,
        };
      } catch (e) {
        return {
          ok: false,
          errors: formatErr(e, models),
        };
      }
    },
    createTeam: async (_, args, { models, user }) => {
      try {
        await models.Team.create({
          ...args,
          owner: user.id,
        });
        return true;
      } catch (e) {
        console.error(e);
        return false;
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
