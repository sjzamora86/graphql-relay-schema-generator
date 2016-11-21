import {DATA_TYPES} from '../datatypes';
import {GeneratorType} from './generator-type';
export class Integer extends GeneratorType{
    constructor() {
        super(DATA_TYPES.INTEGER);
    }
}