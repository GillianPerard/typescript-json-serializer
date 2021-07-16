import { JsonProperty, JsonObject } from '../../src';
import { Animal } from './animal';

@JsonObject()
export class Snake extends Animal {
    @JsonProperty() isPoisonous: boolean;

    constructor(args: { name: string; isPoisonous: boolean }) {
        super(args.name);
        this.isPoisonous = args.isPoisonous;
    }
}
