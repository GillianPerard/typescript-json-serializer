import { Serializable, JsonProperty } from './../../src';
import { Animal } from './animal';
import { Employee } from './employee';
import { Panther } from './panther';

@Serializable()
export class Zoo {

    @JsonProperty()
    public boss: Employee;
    @JsonProperty()
    public city: string;
    @JsonProperty()
    public country: string;
    @JsonProperty({ type: Employee })
    public employees: Array<Employee>;
    @JsonProperty()
    public id: number;
    @JsonProperty()
    public name: string;
    @JsonProperty({ name: 'Panthers', type: Panther })
    public panthers: Array<Panther>;

    public isOpen: boolean = true;

    public constructor() { }

}
