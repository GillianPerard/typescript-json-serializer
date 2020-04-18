import { JsonProperty, Serializable } from '../../src';

@Serializable()
export class LivingBeing {
    /**
     * The living being id
     */
    @JsonProperty()
    id: number;
}
