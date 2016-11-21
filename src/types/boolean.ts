import {DATA_TYPES} from '../datatypes';
import {GeneratorType} from './generator-type';
export class Boolean extends GeneratorType{
    constructor() {
        super(DATA_TYPES.BOOLEAN);
    }
}