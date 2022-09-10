import { JsonObject, JsonProperty } from '../../src';
import { Human } from './human';
import { Society } from './society';
import { Zoo } from './zoo';

@JsonObject()
export class Organization extends Society {
    @JsonProperty({ name: 'zoos', type: Zoo }) zoos: Array<Zoo>;
    @JsonProperty({ dataStructure: 'dictionary' })
    zoosName: { [id: string]: string };
    @JsonProperty({
        name: ['mainShareholder', 'secondaryShareholder', 'thirdShareholder'],
        type: Human,
        beforeDeserialize: value => Object.values(value),
        afterSerialize: value => ({
            mainShareholder: value[0],
            secondaryShareholder: value[1],
            thirdShareholder: value[2]
        })
    })
    shareholders: Array<Human | null | undefined>;
}
