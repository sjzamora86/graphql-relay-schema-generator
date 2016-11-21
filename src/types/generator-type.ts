export class GeneratorType {
    _type: any;
    isRequired: boolean = false;
    isPrimary: boolean = false;

    constructor(type: any) {
        this._type = type;
        return this;
    }

    required() {
        this.isRequired = true;
        return this;
    }

    primary(){
        this.isRequired = true;
        this.isPrimary = true;
        return this;
    }
}