import { JsonProperty, Serializable } from '../../src';
import { Human } from './human';
import { Zoo } from './zoo';

@Serializable()
export class Organization {
    @JsonProperty() id: string;
    @JsonProperty() name: string;
    @JsonProperty({ type: Zoo }) zoos: Array<Zoo>;
    @JsonProperty({
        names: ['mainShareholder', 'secondaryShareholder', 'thirdShareholder'],
        type: Human,
        onDeserialize: value => Object.values(value),
        onSerialize: value => {
            return {
                mainShareholder: value[0],
                secondaryShareholder: value[1],
                thirdShareholder: value[2]
            };
        }
    })
    shareholders: Array<Human>;
}
