import { Serializable, JsonProperty } from '../../src';

import { Gender } from './gender';
import { Status } from './status';
import { LivingBeing } from './living-being';

@Serializable()
export class Animal extends LivingBeing {
    @JsonProperty()
    name: string;
    @JsonProperty()
    birthDate: Date;
    @JsonProperty()
    numberOfPaws: number;
    @JsonProperty()
    gender: Gender;
    @JsonProperty('childrenIdentifiers')
    childrenIds: Array<number>;
    @JsonProperty()
    status: Status;

    constructor(name: string) {
        super();
        this.name = name;
    }
}
