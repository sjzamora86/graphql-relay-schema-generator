import {DATA_TYPES} from '../datatypes';
import {GeneratorType} from './generator-type';
export class Float extends GeneratorType{
    constructor() {
        super(DATA_TYPES.FLOAT);
    }
}