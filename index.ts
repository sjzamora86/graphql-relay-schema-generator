import {SchemaGenerator} from './src/schema-generator';
import {Integer} from './src/types/integer';
import {Float} from './src/types/float';
import {String} from './src/types/string';
import {Boolean} from './src/types/boolean';
import {ID} from './src/types/id';

export function getSchema(schema: any[], resolvers: any[]): any {
    const generator = new SchemaGenerator();
    return generator.generate(schema, resolvers);
}

export function id(): any {
    return new ID();
}

export function integer(): Integer {
    return new Integer();
}

export function float(): any {
    return new Float();
}

export function string(): any {
    return new String();
}

export function boolean(): any {
    return new Boolean();
}


