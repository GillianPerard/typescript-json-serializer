import { Serializable, JsonProperty } from '../../src';

import { Employee } from './employee';
import { Panther } from './panther';
import { Snake } from './snake';
import { Animal } from './animal';

const snakeOrPanther: Function = (animal: any): Function => {
    return animal['isPoisonous'] !== undefined ? Snake : Panther;
};

const coordinatesToArray: Function = (coordinates: { x: number; y: number; z: number }): Array<number> => {
    return Object.values(coordinates);
};

const arrayToCoordinates: Function = (array: Array<number>): { x: number; y: number; z: number } => {
    return {
        x: array[0],
        y: array[1],
        z: array[2]
    };
};

@Serializable()
export class Zoo {
    @JsonProperty()
    public boss: Employee;
    @JsonProperty()
    public city: string;
    @JsonProperty()
    public country: string;
    @JsonProperty({ onDeserialize: arrayToCoordinates, onSerialize: coordinatesToArray })
    public coordinates: { x: number; y: number; z: number };
    @JsonProperty()
    public description: string;
    @JsonProperty({ type: Employee })
    public employees: Array<Employee>;
    @JsonProperty()
    public id: number;
    @JsonProperty()
    public name: string;
    @JsonProperty({ name: 'Animals', predicate: snakeOrPanther })
    public animals: Array<Animal>;
    @JsonProperty({ predicate: snakeOrPanther })
    public mascot: Panther | Snake;
    @JsonProperty()
    public bestEmployeeOfTheMonth: Employee;

    public isOpen: boolean = true;

    public constructor() {}
}
