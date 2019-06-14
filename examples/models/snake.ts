import { Animal } from './animal';
import { JsonProperty, Serializable } from '../../src';

@Serializable('Animal')
export class Snake extends Animal {

    @JsonProperty()
    public isPoisonous: boolean;

    public constructor(name: string) {
        super(name);
    }

}
