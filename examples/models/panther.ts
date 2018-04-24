import { Serializable, JsonProperty } from './../../src';
import { Animal } from './animal';

@Serializable('Animal')
export class Panther extends Animal {

    @JsonProperty()
    public color: string;
    @JsonProperty()
    public isSpeckled: boolean;

    public constructor() {
        super();
    }

}
