import { Serializable, JsonProperty } from '../../src';

import { LivingBeing } from './living-being';
import { Gender } from './gender';

@Serializable()
export class Employee extends LivingBeing {
    /** The employee's email */
    @JsonProperty()
    email: string;

    constructor(
        // This comment works
        @JsonProperty() public name: string,
        @JsonProperty() public gender: Gender,
        /** The birth date of the employee (readonly) */
        @JsonProperty() public readonly birthDate: Date
    ) {
        super();
    }
}
