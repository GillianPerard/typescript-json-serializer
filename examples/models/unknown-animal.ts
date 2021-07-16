import { JsonObject } from '../../src';

import { Animal } from './animal';

@JsonObject()
export class UnknownAnimal extends Animal {
    constructor(name: string) {
        super(name);
    }
}
