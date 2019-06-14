import { Serializable, JsonProperty } from './../../src';

import { Gender } from './gender';
import { Status } from './status';

@Serializable()
export class Animal {

    @JsonProperty()
    public id: number;
    @JsonProperty()
    public name: string;
    @JsonProperty()
    public birthDate: Date;
    @JsonProperty()
    public numberOfPaws: number;
    @JsonProperty()
    public gender: Gender;
    @JsonProperty('childrenIdentifiers')
    public childrenIds: Array<number>;
    @JsonProperty()
    public status: Status;

    public constructor(name: string) {
        this.name = name;
    }

}
