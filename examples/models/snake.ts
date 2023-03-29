import { JsonObject, JsonProperty } from '../../src';
import { Animal } from './animal';

@JsonObject({ constructorParams: [{}] })
export class Snake extends Animal {
    @JsonProperty() isPoisonous: boolean;

    constructor(args: { name: string | undefined; isPoisonous: boolean }) {
        super(args.name);
        this.isPoisonous = args.isPoisonous;
    }
}
