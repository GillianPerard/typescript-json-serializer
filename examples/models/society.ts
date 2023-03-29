import { JsonObject, JsonProperty } from '../../src';

@JsonObject()
export class Society {
    @JsonProperty({ required: true }) id = '4';
    @JsonProperty() name: string;
}
