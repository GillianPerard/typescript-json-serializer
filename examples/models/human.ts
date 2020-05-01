import { Serializable, JsonProperty } from '../../src';

import { Gender } from './gender';
import { LivingBeing } from './living-being';

@Serializable()
export class Human extends LivingBeing {
    constructor(
        // This comment works
        @JsonProperty() public name: string,
        public id: number,
        @JsonProperty() public gender: Gender,
        /** The birth date of the employee (readonly) */
        @JsonProperty() public readonly birthDate: Date
    ) {
        super();
        this.id = id;
    }
}
