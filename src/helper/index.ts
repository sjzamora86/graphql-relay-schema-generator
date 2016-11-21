import {GeneratorType} from '../types/generator-type';
import {DATA_TYPES} from '../datatypes';
const graphql = require('graphql');

export function getGraphQLType(type: GeneratorType): any {
    switch (type._type) {
        case DATA_TYPES.ID:
            return graphql.GraphQLID;
        case DATA_TYPES.INTEGER:
            return graphql.GraphQLInt;
        case DATA_TYPES.FLOAT:
            return graphql.GraphQLFloat;
        case DATA_TYPES.STRING:
            return graphql.GraphQLString;
        case DATA_TYPES.BOOLEAN:
            return graphql.GraphQLBoolean;
    }
}