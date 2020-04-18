import { Serializable } from '../../src';

import { Animal } from './animal';

@Serializable()
export class UnknownAnimal extends Animal {
    constructor(name: string) {
        super(name);
    }
}
