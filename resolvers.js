import bcrypt from 'bcrypt';

export default {
  Query: {
    getUser: (_, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (_, args, { models }) => models.User.findAll(),
    hi: () => 'asdasd',
  },
  Mutation: {
    register: async (_, { password, ...otherArgs }, { models }) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 12);
        await models.User.create({ ...otherArgs, password: hashedPassword });
        return true;
      } catch (e) {
        console.log(e.message);
        return false;
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
