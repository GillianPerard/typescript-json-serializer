import { JsonProperty, Serializable } from '../../src';
import { Animal } from './animal';

@Serializable()
export class Snake extends Animal {
    @JsonProperty()
    isPoisonous: boolean;

    constructor(name: string) {
        super(name);
    }
}
