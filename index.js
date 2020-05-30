import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';
import { refreshTokens } from './auth';

const SECRET = 'asd2ad9a8sda98da9dh';
const SECRET2 = 'asdlaalsdml22lk13l12m4lk5l1kl';

// initial the project
const app = express();
const path = '/graphql';

app.use(async (req, res, next) => {
  // eslint-disable-next-line prefer-destructuring
  const token = req.headers.token;
  if (token) {
    try {
      console.log(token);
      const { user } = await jwt.verify(token, SECRET);
      console.log(user);
      req.user = user;
    } catch (e) {
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  cors: '*',
  context: ({ req }) => ({
    models,
    SECRET,
    currentUser: req.user,
    SECRET2,
  }),
  /* playground: {
    endpoint: '/graphql',
    settings: {
      'editor.theme': 'light',
    },
  }, */
});

server.applyMiddleware({ app, path });
const PORT = 4000;
app.listen(({ port: PORT }), () => {
  models.sequelize.sync().then(() => { console.log(`🚀  Server ready at PORT: ${PORT}${server.graphqlPath}`); });
});
