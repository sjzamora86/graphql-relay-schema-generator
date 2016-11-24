import {GeneratorType} from '../types/generator-type';
import {DATA_TYPES} from '../datatypes';
import PageInfo from '../pagination/page-info';
const R = require('ramda');
const graphql = require('graphql');
const relay = require('graphql-relay');
const mergeAll = R.mergeAll;
const hasType = R.hasIn('_type');
const hasArgs = R.hasIn('args');
const clone = R.clone;

//Function helpers to get list types
const withListType = value => !R.isEmpty(value);
const conditionObject = R.cond([
    [R.is(Object), R.always('')],
    [R.is(String), (str) => str]
]);
const isList = R.compose(R.not, R.isEmpty, R.match(/.*\[.*\].*/g), conditionObject);
const pipeListType = R.pipe(R.pickBy(isList), R.values);
const removeBrackets = (value: string) => {
    return R.replace(/[\[\]']+/g, '', value);
};

//Function helpers to get primary keys
const isPrimaryKey = (obj: any) => {
    if (!R.is(Object, obj)) return false;
    return obj.isPrimary();
};
const filterKey = R.filter(isPrimaryKey);
const getPrimaryKey = R.compose(R.head, R.keys);

//Function helpers for sub resolvers
const hasSubItemResolverFormatCond = R.compose(R.equals(2), R.length, R.split('.'));
const hasSubItemResolverFormat = s => hasSubItemResolverFormatCond(s);
const hasSubItemResolver = R.compose(R.not, R.isEmpty, R.filter(hasSubItemResolverFormat), R.keys);


export function getListTypes(types: any): any {
    const filterProps = R.filter(withListType, R.map(pipeListType, types));
    return R.map(removeBrackets, R.flatten(R.values(filterProps)));
}

export function getGraphQLType(field: GeneratorType): any {
    let graphQLType: any;
    switch (field.type()) {
        case DATA_TYPES.ID:
            graphQLType = graphql.GraphQLID;
            break;
        case DATA_TYPES.INTEGER:
            graphQLType = graphql.GraphQLInt;
            break;
        case DATA_TYPES.FLOAT:
            graphQLType = graphql.GraphQLFloat;
            break;
        case DATA_TYPES.STRING:
            graphQLType = graphql.GraphQLString;
            break;
        case DATA_TYPES.BOOLEAN:
            graphQLType = graphql.GraphQLBoolean;
            break;
    }
    return field.isRequired() ? new graphql.GraphQLNonNull(graphQLType) : graphQLType;
}

export function createSimpleQueryType(graphQLObjectType: any): any {
    return {
        type: graphQLObjectType
    }
}

export function createPaginationQueryType(name: string, graphQLObjectType: any, primaryKey: string): any {
    return {
        type: createConnectionType(name, graphQLObjectType, primaryKey),
        args: relay.connectionArgs
    }
}

export function createConnectionType(name: string, graphQLType: any, primaryKey: string): any {
    return new graphql.GraphQLObjectType({
        name: `${name}Connection`,
        description: `${name} Connection for pagination`,
        fields: () => ({
            edges: {
                type: new graphql.GraphQLList(createEdgeType(name, graphQLType, primaryKey)),
                resolve: (root) => root.data
            },
            pageInfo: {
                type: new graphql.GraphQLNonNull(PageInfo)
            }
        })
    });
}

export function createEdgeType(name: string, graphQLType: any, primaryKey: string): any {
    return new graphql.GraphQLObjectType({
        name: `${name}Edge`,
        description: `${name} Edge for pagination`,
        fields: () => ({
            cursor: {
                type: graphql.GraphQLString,
                resolve: (root) => root[primaryKey]
            },
            node: {
                type: graphQLType,
                resolve: (root) => root
            }
        })
    });
}

export {getPrimaryKey};
export {filterKey};
export {isList};
export {mergeAll};
export {hasType};
export {hasArgs};
export {clone};
export {removeBrackets};
export {hasSubItemResolver};