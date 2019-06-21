import { Serializable, JsonProperty } from './../../src';

import { Gender } from './gender';

@Serializable()
export class Employee {

    /**
     * The employee's id
     */
    @JsonProperty()
    public id: number;

    /** The employee's email */
    @JsonProperty()
    public email: string;

    public constructor(
        // This comment works
        @JsonProperty() public name: string,
        @JsonProperty() public gender: Gender,
        /** The birth date of the employee (readonly) */
        @JsonProperty() public readonly birthDate: Date
    ) { }

}
