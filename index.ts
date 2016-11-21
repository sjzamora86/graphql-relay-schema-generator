import {SchemaGenerator} from './src/schema-generator';
import {Integer} from './src/types/integer';
import {Float} from './src/types/float';
import {String} from './src/types/string';
import {Boolean} from './src/types/boolean';
import {ID} from './src/types/id';

var objSchema = {
    types: {
        Message: {
            id: string().primary(),
            message: string().required()
        },
        User: {
            id: string().primary(),
            name: string().required(),
            status: boolean().required(),
            messages: '[Message]'
        }
    },
    queries: {
        user: {
            type: "User",
            args: {
                id: string()
            }
        },
        users: "[User]"
    }
}

var resolvers = {
    user: (root, args) => {
        return Promise.resolve([
            {
                id: "test id",
                name: "name",
                status: true
            },
            {
                id: "test id",
                name: "name",
                status: true
            }]);
    }
}
var schema = getSchema([objSchema], [resolvers]);
console.log(JSON.stringify(schema));

export function getSchema(schema: any[], resolvers: any[]): any {
    const generator = new SchemaGenerator();
    return generator.generate(schema, resolvers);
}

export function printMessage(message?: string) {
    console.log(`message ${message}`);
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


