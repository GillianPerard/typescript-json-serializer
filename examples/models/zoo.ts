import { JsonObject, JsonProperty } from '../../src';

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

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function phoneNumberType(property: any) {
    if (property && property.value !== undefined) {
        return PhoneNumber;
    }
}

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
    @JsonProperty({ type: Employee, dataStructure: 'set' })
    employees: Set<Employee> | undefined;
    @JsonProperty()
    id: number;
    @JsonProperty()
    name: string;
    @JsonProperty({ name: 'Animals', type: snakeOrPanther })
    animals: Array<Animal>;
    @JsonProperty({ type: snakeOrPanther })
    mascot: Panther | Snake;
    @JsonProperty({ dataStructure: 'dictionary', type: UnknownAnimal })
    unknownAnimals: { [id: string]: UnknownAnimal };
    @JsonProperty({ type: phoneNumberType })
    phoneBook: Map<string, Array<PhoneNumber | string>>;

    isOpen = true;
}
