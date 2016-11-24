import {
    getGraphQLType,
    mergeAll,
    isList,
    getPrimaryKey,
    getListTypes,
    removeBrackets,
    createSimpleQueryType,
    createPaginationQueryType,
    filterKey,
    hasArgs
} from './helper/index';
import {Dictionary} from './helper/dictionary';

const graphql = require('graphql');
const R = require('ramda');
const graphQLObjecTypes: Dictionary<any> = new Dictionary<any>();
const graphQLQueries: Dictionary<any> = new Dictionary<any>();
let mergeSchemas: any;
let mergeResolvers: any;

const createObject = (name: string, fields: any) => {
    return new graphql.GraphQLObjectType({
        name: name,
        description: `Auto generated description ${name}`,
        fields: () => createGraphQLFields(name, fields)
    });
};

const createGraphQLFields = (name: string, fields: any) => {
    const concatName = (key) => R.concat(`${name}.`, key);
    const fieldsWithType = R.map(createGraphQLFieldType, fields);
    const concatFieldKeys = R.compose(R.map(concatName), R.keys);
    R.map((concatFieldKey: string) => {
        if(R.hasIn(concatFieldKey, mergeResolvers)) {
            const trimmedKey = concatFieldKey.replace(R.concat(name, '.'), '');
            fieldsWithType[trimmedKey]['resolve'] = mergeResolvers[concatFieldKey];
        }
    }, concatFieldKeys(fieldsWithType));
    return fieldsWithType;
};

const createGraphQLFieldType = (field: any) => {
    if (isList(field)) {
        const fieldType = removeBrackets(field);
        const primaryKey = getPrimaryKey(filterKey(mergeSchemas.types[fieldType]));
        return createPaginationQueryType(fieldType, graphQLObjecTypes.item(fieldType), primaryKey);
    }
    return {
        type: getGraphQLType(field)
    }

};

const createGraphQLObjectFromList = (itemType: string) => {
    if (!graphQLObjecTypes.containsKey(itemType)) {
        graphQLObjecTypes.add(itemType, createObject(itemType, mergeSchemas.types[itemType]));
    }
};

const createGraphQLObject = (fields: any, itemType: string) => {
    if (!graphQLObjecTypes.containsKey(itemType)) {
        graphQLObjecTypes.add(itemType, createObject(itemType, fields));
    }
};

const createGraphQLQueries = (query: any, queryName: string) => {
    if (!graphQLQueries.containsKey(queryName)) {
        graphQLQueries.add(queryName, createGraphQLQuery(query, queryName));
    }
};

const createGraphQLQuery = (query: any, queryName: string) => {
    let graphQLQuery: any = {};
    let queryType = query.type;
    if (hasArgs(query)) graphQLQuery['args'] = R.map(createGraphQLFieldType, query.args);
    if (R.hasIn(queryName, mergeResolvers)) graphQLQuery['resolve'] = R.prop(queryName, mergeResolvers);

    if (isList(queryType)) {
        queryType = removeBrackets(query.type);
        const primaryKey = getPrimaryKey(filterKey(mergeSchemas.types[queryType]));
        return R.merge(graphQLQuery, createPaginationQueryType(queryType, graphQLObjecTypes.item(queryType), primaryKey));
    }

    return R.merge(graphQLQuery, createSimpleQueryType(graphQLObjecTypes.item(queryType)));
};


export class SchemaGenerator {

    generate(schemas: any[], resolvers: any[]): any {

        mergeSchemas = mergeAll(schemas);
        mergeResolvers = mergeAll(resolvers);

        const listTypes = getListTypes(mergeSchemas.types);
        const omitted = R.omit(listTypes, mergeSchemas.types);
        R.map(createGraphQLObjectFromList, listTypes);
        R.mapObjIndexed(createGraphQLObject, omitted);
        R.mapObjIndexed(createGraphQLQueries, mergeSchemas.queries);

        const queries = graphQLQueries.getItems();

        const RootQuery = new graphql.GraphQLObjectType({
            name: 'RootQuery',
            fields: queries
        });

        const GraphQLSchema = new graphql.GraphQLSchema({
            query: RootQuery
        });

        return GraphQLSchema;
    }
}