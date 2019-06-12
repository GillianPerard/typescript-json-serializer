import { Serializable, JsonProperty } from './../../src';

import { Gender } from './gender';

@Serializable()
export class Employee {

    @JsonProperty()
    public id: number;
    @JsonProperty()
    public name: string;
    @JsonProperty()
    public birthDate: Date;
    @JsonProperty()
    public email: string;
    @JsonProperty()
    public gender: Gender;

    public constructor() { }

}
