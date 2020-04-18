import { Serializable, JsonProperty } from '../../src';
import { Animal } from './animal';

@Serializable()
export class Panther extends Animal {
    @JsonProperty() color: string;

    constructor(name: string, @JsonProperty() public isSpeckled: boolean) {
        super(name);
    }
}
