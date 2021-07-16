import { JsonProperty, JsonObject } from '../../src';
import { Animal } from './animal';

@JsonObject()
export class Panther extends Animal {
    @JsonProperty() color: string;

    constructor(name: string, @JsonProperty() public isSpeckled: boolean) {
        super(name);
    }
}
