import { Serializable } from '../../src';

@Serializable({ primitive: true })
export class Primitive {
    private readonly _value: string | number | boolean;

    constructor(value: string | number | boolean) {
        this._value = value;
    }

    valueOf(): Object {
        return this._value;
    }
}
