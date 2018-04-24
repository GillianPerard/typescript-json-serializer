import { Serializable, JsonProperty } from './../../src';
import { Animal } from './animal';

export class Snake extends Animal {

    public isPoisonous: boolean;

    public constructor() {
        super();
    }

}
