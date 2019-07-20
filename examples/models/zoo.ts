import { Serializable, JsonProperty } from '../../src';

import { Employee } from './employee';
import { Panther } from './panther';
import { Snake } from './snake';
import { Animal } from './animal';

const predicate: Function = (animal: any): Function => {
    return animal['isPoisonous'] !== undefined ? Snake : Panther;
};

@Serializable()
export class Zoo {

    @JsonProperty()
    public boss: Employee;
    @JsonProperty()
    public city: string;
    @JsonProperty()
    public country: string;
    @JsonProperty()
    public description: string;
    @JsonProperty({ type: Employee })
    public employees: Array<Employee>;
    @JsonProperty()
    public id: number;
    @JsonProperty()
    public name: string;
    @JsonProperty({ name: 'Animals', predicate })
    public animals: Array<Animal>;
    @JsonProperty({ predicate })
    public mascot: Panther | Snake;

    public isOpen: boolean = true;

    public constructor() { }

}
