import { JsonProperty, JsonObject } from '../../src';
import { Animal } from './animal';

@JsonObject()
export class Snake extends Animal {
    @JsonProperty()
    isPoisonous: boolean;

    constructor(name: string) {
        super(name);
    }
}
