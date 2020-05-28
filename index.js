import { ApolloServer } from 'apollo-server';
import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: '/graphql',
    settings: {
      'editor.theme': 'light',
    },
  },
});


server.listen()
  .then(({ url }) => {
    models.sequelize.sync({ force: true })
      .then(() => {
        console.log(`🚀  Server ready at ${url}`);
      });
  });
