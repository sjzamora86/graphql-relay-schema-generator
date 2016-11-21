import {DATA_TYPES} from '../datatypes';
import {GeneratorType} from './generator-type';
export class String extends GeneratorType{
    constructor() {
        super(DATA_TYPES.STRING);
    }
}