import { JsonProperty, JsonObject } from '../../src';

@JsonObject()
export class Society {
    @JsonProperty() id: string;
    @JsonProperty() name: string;
}
