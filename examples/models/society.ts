import { JsonProperty, Serializable } from '../../src';

@Serializable()
export class Society {
    @JsonProperty() id?: string;
    @JsonProperty() name: string | null;
}
