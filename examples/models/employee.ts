import { Serializable, JsonProperty } from './../../src';

import { Gender } from './gender';

@Serializable()
export class Employee {

    @JsonProperty()
    public id: number;
    @JsonProperty()
    public email: string;

    public constructor(
        @JsonProperty() public name: string,
        @JsonProperty() public gender: Gender,
        @JsonProperty() public readonly birthDate: Date
    ) { }

}
