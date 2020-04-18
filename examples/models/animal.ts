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

// tslint:disable: max-classes-per-file
@Serializable()
class Lala {
    @JsonProperty() id: string;

    constructor(id: string) {
        this.id = id;
    }
}

@Serializable()
// tslint:disable-next-line: no-unused
class Student extends Lala {
    @JsonProperty() birthDate: Date;

    constructor(
        id: string,
        /* lala */
        @JsonProperty() public name: string,
        birthDate: Date
    ) {
        super(id);
        this.birthDate = birthDate;
    }
}
