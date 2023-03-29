import { JsonObject, JsonProperty } from '../../src';
import { Animal } from './animal';

@JsonObject()
export class Panther extends Animal {
    @JsonProperty() color: string;

    constructor(name: string | undefined, @JsonProperty() public isSpeckled: boolean) {
        super(name);
    }
}
