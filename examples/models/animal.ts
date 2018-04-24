import { Serializable, JsonProperty } from './../../src';
import { Gender } from './gender';

@Serializable()
export class Animal {

    @JsonProperty()
    public id: number;
    @JsonProperty()
    public name: string;
    @JsonProperty()
    public birthdate: Date;
    @JsonProperty()
    public numberOfPaws: number;
    @JsonProperty()
    public gender: string;
    @JsonProperty('childrenIdentifiers')
    public childrenIds: Array<number>;

    public constructor() { }

}
