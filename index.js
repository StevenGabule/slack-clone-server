import { ApolloServer } from 'apollo-server';
import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';


const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  cors: '*',
  context: {
    models,
    user: {
      id: 1,
    },
  },
  playground: {
    endpoint: '/graphql',
    settings: {
      'editor.theme': 'light',
    },
  },
});

server.listen().then(({ url }) => {
  models.sequelize.sync().then(() => {
    console.log(`🚀  Server ready at ${url}`);
  });
});
