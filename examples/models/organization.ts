import { JsonProperty, Serializable } from '../../src';
import { Human } from './human';
import { Society } from './society';
import { Zoo } from './zoo';

const prefixWithUnderscore = (propertyName: string) => {
    return `_${propertyName}`;
};

@Serializable({ formatPropertyNames: prefixWithUnderscore })
export class Organization extends Society {
    @JsonProperty({ name: 'zoos', type: Zoo }) zoos: Array<Zoo>;
    @JsonProperty({
        names: ['_mainShareholder', '_secondaryShareholder', '_thirdShareholder'],
        type: Human,
        onDeserialize: value => Object.values(value),
        onSerialize: value => ({
            _mainShareholder: value[0],
            _secondaryShareholder: value[1],
            _thirdShareholder: value[2]
        })
    })
    shareholders: Array<Human | null | undefined>;
}
