const R = require('ramda');

interface IKeyedCollection<T> {
    add(key: string, value: T);
    containsKey(key: string): boolean;
    count(): number;
    item(key: string): T;
    keys(): string[];
    remove(key: string): T;
    values(): T[];
}

export class Dictionary<T> implements IKeyedCollection<T> {
    private items: { [index: string]: T } = {};

    public containsKey(key: string): boolean {
        return R.hasIn(key, this.items);
    }

    public count(): number {
        return R.keys(this.items).length;
    }

    public add(key: string, value: T) {
        this.items[key] = value;
    }

    public remove(key: string): T {
        let val = this.items[key];
        delete this.items[key];
        return val;
    }

    public item(key: string): T {
        return this.items[key];
    }

    public keys(): string[] {
        return R.keys(this.items);
    }

    public values(): T[] {
        return R.values(this.items);
    }

    public getItems(): any {
        return this.items;
    }
}
