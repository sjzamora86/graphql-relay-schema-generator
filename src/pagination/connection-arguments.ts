const graphql = require('graphql');

export function createConnectionArguments(): any {
  return {
    first: {
      type: graphql.GraphQLInt,
    },
    last: {
      type: graphql.GraphQLInt,
    },
    before: {
      type: graphql.GraphQLString,
    },
    after: {
      type: graphql.GraphQLString,
    },
  };
}
