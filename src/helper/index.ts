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

const isPrimaryKey = (obj: any) => {
    if(!R.is(Object, obj)) return false;
    return obj.isPrimary();
};
const withListType = value => !R.isEmpty(value);
const isListString = (value: string) => {
    return (value[0] == '[' && value[value.length - 1] == ']')
};
const isList = R.match(/.*\[.*\].*/g);
const pipeListType = R.pipe(R.pickBy(isListString), R.values);
const removeBrackets = (value: string) => {
    return R.replace(/[\[\]']+/g, '', value);
};
const filterKey = R.filter(isPrimaryKey);
const getPrimaryKey = R.compose(R.head, R.keys);

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
export {isListString};
export {mergeAll};
export {hasType};
export {hasArgs};
export {clone};
export {removeBrackets};