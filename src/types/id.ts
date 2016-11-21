import {DATA_TYPES} from '../datatypes';
import {GeneratorType} from './generator-type';
export class ID extends GeneratorType{
    constructor() {
        super(DATA_TYPES.ID);
    }
}