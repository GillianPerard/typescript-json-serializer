import { Serializable, JsonProperty } from '../../src';
import { Primitive } from './primitive';

@Serializable()
export class Token {
    @JsonProperty() type: 'Bearer' | 'Basic';
    @JsonProperty({ type: Primitive }) header: Primitive;
    @JsonProperty({ type: Primitive }) signature: Primitive;

    constructor(type: 'Bearer' | 'Basic', header: Primitive, signature: Primitive) {
        this.type = type;
        this.header = header;
        this.signature = signature;
    }
}
