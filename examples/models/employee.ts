import { JsonProperty, Serializable } from '../../src';

import { Gender } from './gender';
import { Human } from './human';
import { PhoneNumber } from './phone-number';

@Serializable()
export class Employee extends Human {
    /** The employee's email */
    @JsonProperty()
    email: string;

    /** The employee's phone number */
    @JsonProperty({ nullable: true })
    phoneNumber: PhoneNumber | null;

    constructor(
        public name: string,
        public id: number,
        public gender: Gender,
        public birthDate: Date
    ) {
        super(name, id, gender, birthDate);
    }
}
