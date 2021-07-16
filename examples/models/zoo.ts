import { JsonProperty, JsonObject } from '../../src';

import { Animal } from './animal';
import { Employee } from './employee';
import { Panther } from './panther';
import { Snake } from './snake';
import { UnknownAnimal } from './unknown-animal';
import { PhoneNumber } from './phone-number';

const snakeOrPanther = (animal: any) =>
    animal && animal['isPoisonous'] !== undefined ? Snake : Panther;

const coordinatesToArray = (coordinates: { x: number; y: number; z: number }) =>
    Object.values(coordinates);

const arrayToCoordinates = (array: Array<number>) => ({
    x: array[0],
    y: array[1],
    z: array[2]
});

@JsonObject()
export class Zoo {
    @JsonProperty()
    boss: Employee;
    @JsonProperty()
    city: string;
    @JsonProperty()
    country: string;
    @JsonProperty({ beforeDeserialize: arrayToCoordinates, afterSerialize: coordinatesToArray })
    coordinates: { x: number; y: number; z: number };
    @JsonProperty()
    description: string;
    @JsonProperty({ type: Employee })
    employees: Array<Employee>;
    @JsonProperty()
    id: number;
    @JsonProperty()
    name: string;
    @JsonProperty({ name: 'Animals', predicate: snakeOrPanther })
    animals: Array<Animal>;
    @JsonProperty({ predicate: snakeOrPanther })
    mascot: Panther | Snake;
    @JsonProperty({ isDictionary: true, type: UnknownAnimal })
    unknownAnimals: { [id: string]: UnknownAnimal };
    @JsonProperty({
        isDictionary: true,
        predicate: property => {
            if (property && property.value !== undefined) {
                return PhoneNumber;
            }
        }
    })
    phoneBook: { [id: string]: PhoneNumber | string };

    isOpen = true;

    constructor() {}
}
