import { Animal } from './animal';
import { JsonProperty, Serializable } from '../../src';

@Serializable()
export class Snake extends Animal {
    @JsonProperty()
    isPoisonous: boolean;

    constructor(name: string) {
        super(name);
    }
}
