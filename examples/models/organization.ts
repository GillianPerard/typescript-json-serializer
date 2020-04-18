import { Serializable, JsonProperty } from '../../src';
import { Zoo } from './zoo';

@Serializable()
export class Organization {
    @JsonProperty() id: string;
    @JsonProperty() name: string;
    @JsonProperty({ type: Zoo }) zoos: Array<Zoo>;
}
