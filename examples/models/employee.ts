import { Serializable, JsonProperty } from './../../src';

@Serializable()
export class Employee {

    @JsonProperty()
    public id: number;
    @JsonProperty()
    public name: string;
    @JsonProperty()
    public birthdate: Date;
    @JsonProperty()
    public email: string;
    @JsonProperty()
    public gender: string;

    public constructor() { }

}
