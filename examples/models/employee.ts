import { Serializable, JsonProperty } from '../../src';

import { Gender } from './gender';
import { Human } from './human';

@Serializable()
export class Employee extends Human {
    /** The employee's email */
    @JsonProperty()
    email: string;

    constructor(
        public name: string,
        public id: number,
        public gender: Gender,
        public birthDate: Date
    ) {
        super(name, id, gender, birthDate);
    }
}
