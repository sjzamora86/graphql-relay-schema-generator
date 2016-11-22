import {GeneratorType} from '../types/generator-type';
import {DATA_TYPES} from '../datatypes';
const R = require('ramda');
const graphql = require('graphql');
const mergeAll = R.mergeAll;
const hasType = R.hasIn('_type');
const hasArgs = R.hasIn('args');
const clone = R.clone;

const withListType = value => !R.isEmpty(value);
const isListString = (value: string) => {
    return (value[0] == '[' && value[value.length - 1] == ']')
};
const isList = R.match(/.*\[.*\].*/g);
const pipeListType = R.pipe(R.pickBy(isListString), R.values);
const removeBrackets = (value: string) => {
    return R.replace(/[\[\]']+/g, '', value);
};

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

export {isList};
export {mergeAll};
export {hasType};
export {hasArgs};
export {clone};
export {removeBrackets};