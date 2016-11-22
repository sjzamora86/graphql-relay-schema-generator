export class GeneratorType {
    private _type: any;
    private _isRequired: boolean = false;
    private _isPrimary: boolean = false;

    constructor(type: any) {
        this._type = type;
        return this;
    }

    public type(): any {
        return this._type;
    }

    public isRequired(): any {
        return this._isRequired;
    }

    public isPrimary(): any {
        return this._isPrimary;
    }

    public required() {
        this._isRequired = true;
        return this;
    }

    public primary() {
        this._isRequired = true;
        this._isPrimary = true;
        return this;
    }
}