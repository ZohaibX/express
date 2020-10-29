const Resolvers = require('../../graphql/resolvers/resolvers');
const Schema = require('../../graphql/schemas/schema');
const { graphqlHTTP } = require('express-graphql');

module.exports = (app) => {
  app.use(
    '/graphql',
    graphqlHTTP({
      schema: Schema,
      rootValue: Resolvers,
      graphiql: true,
    })
  );
};
