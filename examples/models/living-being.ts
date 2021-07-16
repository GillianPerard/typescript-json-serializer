import { JsonProperty, JsonObject } from '../../src';

@JsonObject()
export class LivingBeing {
    /**
     * The living being id
     */
    @JsonProperty()
    id: number;
}
