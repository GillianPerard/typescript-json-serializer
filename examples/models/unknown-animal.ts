import { Serializable } from '../../src';

import { Animal } from './animal';

@Serializable('Animal')
export class UnknownAnimal extends Animal {
    public constructor(name: string) {
        super(name);
    }
}
