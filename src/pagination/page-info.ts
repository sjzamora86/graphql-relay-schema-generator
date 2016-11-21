const graphql = require('graphql');

export default new graphql.GraphQLObjectType({
  name: 'PageInfo',
  description: 'Pagination page info',
  fields: () => ({
    hasNextPage: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLBoolean),
    },
    hasPreviousPage: {
      type: new graphql.GraphQLNonNull(graphql.GraphQLBoolean),
    }
  })
});
