import * as R from 'ramda';
import {getGraphQLType} from './helper/index';
const graphql = require('graphql');
const mergeAll = R.mergeAll;
const isNested = (val, key) => !R.hasIn('_type', val);
const isNotNested = (val, key) => R.hasIn('_type', val);
const createGraphQLObject = (name: string, fields: any) => {
    return new graphql.GraphQLObjectType({
        name: `Auto${name}`,
        description: `Auto generated description ${name}`,
        fields: () => (R.mapObjIndexed(createGraphQLFields, fields))
    });
};
const createGraphQLFields = (field: any, key: any, obj: any) => {
    if (R.hasIn('_type', field)) {
        return {
            type: field.isRequired ? new graphql.GraphQLNonNull(getGraphQLType(field)) : getGraphQLType(field)
        }
    } else {
        return {
            type: new graphql.GraphQLList(createGraphQLObject(key, field))
        }
    }
};

const createGraphQLQueries = (query: any, key: any, obj: any) => {

};

export class SchemaGenerator {

    generate(schemas: any[], resolvers: any[]): any {

        const finalSchema = mergeAll(schemas);
        const finalResolvers = mergeAll(resolvers);

        return finalSchema;

        /*let rootQueryFields = {};
        R.map((query: any) => {
            R.mapObjIndexed(createGraphQLQueries, query);
        }, queries);

        const RootQuery = new graphql.GraphQLObjectType({
            name: 'RootQuery',
            fields: rootQueryFields
        });

        const GraphQLSchema = new graphql.GraphQLSchema({
            query: RootQuery
        });

        return GraphQLSchema;*/
    }
}