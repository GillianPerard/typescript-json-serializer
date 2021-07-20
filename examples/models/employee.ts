import { JsonProperty, JsonObject } from '../../src';

import { Gender } from './gender';
import { Human } from './human';
import { PhoneNumber } from './phone-number';

@JsonObject()
export class Employee extends Human {
    /** The employee's email */
    @JsonProperty({ required: true }) email: string;

    @JsonProperty({
        type: property => {
            if (property && property.value !== undefined) {
                return PhoneNumber;
            }
        }
    })
    phoneNumber: PhoneNumber | string;

    constructor(
        public name: string,
        @JsonProperty('employeeId') public id: number,
        public gender: Gender,
        public birthDate: Date
    ) {
        super(name, id, gender, birthDate);
    }
}
