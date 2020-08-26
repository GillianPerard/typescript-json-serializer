# typescript-json-serializer

![](https://github.com/GillianPerard/typescript-json-serializer/workflows/Build/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/GillianPerard/typescript-json-serializer/badge.svg)](https://coveralls.io/github/GillianPerard/typescript-json-serializer)
[![Known Vulnerabilities](https://snyk.io/test/github/gillianperard/typescript-json-serializer/badge.svg?targetFile=package.json)](https://snyk.io/test/github/gillianperard/typescript-json-serializer?targetFile=package.json)

A typescript library to deserialize json into typescript classes and serialize classes into json.

## Installation

```sh
npm install typescript-json-serializer --save
# or
yarn add typescript-json-serializer
```

You also need to set **experimentalDecorators** and **emitDecoratorMetadata** to true into the tsconfig.json file.

For example:

```json
{
    "compilerOptions": {
        ...
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        ...
    }
}
```

## Import

There are two decorators and two functions that you can import inside a typescript file.

```typescript
import { JsonProperty, Serializable, deserialize, serialize } from 'typescript-json-serializer';
```

## Library

### Decorators

```typescript
// Serializable decorator set a class as serializable.
// BREAKING CHANGE: Since version 2.0.0 the
// parameter `baseClassName` is not needed anymore

@Serializable()
```

```typescript
// JsonProperty decorator set metadata to the property.
// It can take some optional parameters like:
// - the name of json property
// - the type of the property (if needed)
// - a predicate function that return a type (if needed)
// - a function to transform data on deserialize
// - a function to transform data on serialize

@JsonProperty(args?:
    | string
    | {
        name?: string,
        type?: Function,
        onDeserialize?: (property: any, currentInstance: any) => {}, onSerialize?: (property: any, currentInstance: any) => {},
        postDeserialize?: (property: any, currentInstance: any) => {},
        isDictionary?: boolean
      }
    | {
        name?: string,
        predicate?: (property: any) => {},
        onDeserialize?: (property: any, currentInstance: any) => {},
        onSerialize?: (property: any, currentInstance: any) => {},
        postDeserialize?: (property: any, currentInstance: any) => {},
        isDictionary?: boolean
      }
    | {
        names?: Array<string>,
        type?: Function,
        onDeserialize?: (property: any, currentInstance: any) => {},
        onSerialize?: (property: any, currentInstance: any) => {},
        postDeserialize?: (property: any, currentInstance: any) => {}
      }
    | {
        names?: Array<string>,
        predicate?: (property: any) => {},
        onDeserialize?: (property: any, currentInstance: any) => {},
        onSerialize?: (property: any, currentInstance: any) => {},
        postDeserialize?: (property: any, currentInstance: any) => {}
    })
```

### Functions

```typescript
// serialize function transform typescript class into json.
// It takes two parameters:
// - a instance of the class to serialize
// - a boolean to remove undefined property (default true)

serialize(instance: any, removeUndefined: boolean = true): any
```

```typescript
// deserialize function transform json into typescript class.
// It takes two parameters:
// - json data
// - the class you want to deserialize into

deserialize<T>(json: any, type: new (...params) => T): T
```

## Example

### Classes

```typescript
// Import decorators from library
import { Serializable, JsonProperty } from 'typescript-json-serializer';

// Enums
export enum Gender {
    Female,
    Male,
    Other
}

export enum Status {
    Alive = 'Alive',
    Sick = 'Sick',
    DeadAndAlive = 'Dead and alive',
    Dead = 'Dead'
}

// Create a serializable class: LivingBeing

// Serializable decorator
@Serializable()
export class LivingBeing {

    /** The living being id (PK) */
    @JsonProperty() id: number;
}


// Create a serializable class that extends LivingBeing: Human

@Serializable()
export class Human extends LivingBeing {
    constructor(
        // This comment works
        @JsonProperty() public name: string,
        public id: number,
        @JsonProperty() public gender: Gender,
        /** This comment works */
        @JsonProperty() public readonly birthDate: Date
    ) {
        super();
        this.id = id;
    }
}


// Create a serializable class: PhoneNumber

@Serializable()
export class PhoneNumber {
    @JsonProperty() countryCode: string;
    @JsonProperty() value: string;
}


// Create a serializable class that extends Human: Employee

@Serializable()
export class Employee extends Human {
    /** The employee's email */
    @JsonProperty() email: string;

    /** Predicate function to determine if the property type is PhoneNumber or a primitive type */
    @JsonProperty({
        predicate: property => {
            if (property && property.value !== undefined) {
                return PhoneNumber;
            }
        }
    })
    phoneNumber: PhoneNumber | string;

    constructor(
        public name: string,
        public id: number,
        public gender: Gender,
        public birthDate: Date
    ) {
        super(name, id, gender, birthDate);
    }
}


// Create a serializable class: Animal

@Serializable()
export class Animal {

    @JsonProperty() id: number;
    @JsonProperty() name: string;
    @JsonProperty() birthDate: Date;
    @JsonProperty() numberOfPaws: number;
    @JsonProperty() gender: Gender;

    // Enum value (string)
    @JsonProperty() status: Status;

    // Specify the property name of json property if needed
    @JsonProperty('childrenIdentifiers')
    childrenIds: Array<number>;

    constructor(name: string) {
        this.name = name;
    }

}


// Create a serializable class that extends Animal (which extends LivingBeing): Panther

@Serializable()
export class Panther extends Animal {

    @JsonProperty() color: string;

    // JsonProperty directly inside the constructor
    // for property parameters
    public constructor(
        name: string,
        @JsonProperty() public isSpeckled: boolean
    ) {
        super(name);
    }

}


// Create a serializable class that extends Animal (which extends LivingBeing): Snake

@Serializable()
export class Snake extends Animal {

    @JsonProperty() isPoisonous: boolean;

    public constructor(name: string) {
        super(name);
    }

}


// Create a serializable empty class that extends Animal (which extends LivingBeing): UnknownAnimal

@Serializable()
export class UnknownAnimal extends Animal {
    public constructor(name: string) {
        super(name);
    }
}


// Create a serializable class: Zoo

// Function to transform coordinates into an array
const coordinatesToArray = (coordinates: { x: number; y: number; z: number }): Array<number> => {
    return Object.values(coordinates);
};

// Function to transform an array into coordinates
const arrayToCoordinates = (array: Array<number>): { x: number; y: number; z: number } => {
    return {
        x: array[0],
        y: array[1],
        z: array[2]
    };
};

// A predicate function use to determine what is the
// right type of the data (Snake or Panther)
const snakeOrPanther = animal => {
    return animal && animal['isPoisonous'] !== undefined ? Snake : Panther;
};

@Serializable()
export class Zoo {

    // Here you do not need to specify the type
    // inside the decorator
    @JsonProperty() boss: Employee;

    @JsonProperty() city: string;
    @JsonProperty() country: string;

    // Property with transform functions executed respectively
    // on serialize and on deserialize
    @JsonProperty({ onDeserialize: arrayToCoordinates, onSerialize: coordinatesToArray })
    coordinates: { x: number; y: number; z: number };

    // Array of none-basic type elements
    @JsonProperty({ type: Employee })
    employees: Array<Employee>;

    @JsonProperty() id: number;
    @JsonProperty() name: string;

    // Array of none-basic type elements where you need to
    // specify the name of the json property
    // and use the predicate function to cast the deserialized
    // object into the correct child class
    @JsonProperty({ name: 'Animals', predicate: snakeOrPanther })
    animals: Array<Animal>;

    // Property that can be Panther or Snake type
    // Use again the predicate function
    @JsonProperty({ predicate: snakeOrPanther })
    mascot: Panther | Snake;

    // Array of empty child classes
    @JsonProperty({ type: UnknownAnimal })
    unknownAnimals: Array<UnknownAnimal>;

    @JsonProperty() bestEmployeeOfTheMonth: Employee;

    // Dictionary of PhoneNumber
    @JsonProperty({ type: PhoneNumber, isDictionary: true })
    phoneBook: {[id: string]: PhoneNumber};

    // Property which will be not serialized and deserialized
    // but event accessible and editable from Zoo class.
    public isFree: boolean = true;

    public constructor() { }

}


// Create a serializable class: Organization

@Serializable()
export class Organization {
    @JsonProperty() id: string;
    @JsonProperty() name: string;
    @JsonProperty({ type: Zoo }) zoos: Array<Zoo>;

    // To merge multiple properties in a single one
    // use the property `names`.
    // If you don't create your own merge with the `onDeserialize`
    // and `onSerialize` function, it will just merge properties in this
    // one when using `deserialize` and split back
    // when using `serialize`
    @JsonProperty({
        names: ['mainShareholder', 'secondaryShareholder', 'thirdShareholder'],
        type: Human,
        onDeserialize: value => Object.values(value),
        onSerialize: value => {
            return {
                mainShareholder: value[0],
                secondaryShareholder: value[1],
                thirdShareholder: value[2]
            };
        }
    })
    shareholders: Array<Human>;
}
```

### Json data

```typescript
// data.ts
export const data: any = {
    id: '1',
    name: 'Zoos Organization',
    zoos: [
        {
            id: 15,
            name: 'The Greatest Zoo',
            city: 'Bordeaux',
            coordinates: [1, 2, 3],
            country: 'France',
            boss: {
                id: 1,
                name: 'Bob Razowsky',
                birthDate: '1984-04-03T22:00:00.000Z',
                email: 'bob.razowsky@tgzoo.fr',
                gender: 1
            },
            employees: [
                {
                    id: 1,
                    name: 'Bob Razowsky',
                    birthDate: '1984-04-03T22:00:00.000Z',
                    email: 'bob.razowsky@tgzoo.fr',
                    gender: 1
                },
                {
                    id: 2,
                    name: 'Mikasa Ackerman',
                    birthDate: '1984-01-11T22:00:00.000Z',
                    email: 'mikasa.ackerman@tgzoo.fr',
                    gender: 0
                },
                {
                    id: 3,
                    name: 'Red Redington',
                    birthDate: '1970-12-04T22:00:00.000Z',
                    email: 'red.redington@tgzoo.fr',
                    gender: 1
                },
                {
                    id: 4,
                    name: 'Fried Richter',
                    birthDate: '1994-04-01T22:00:00.000Z',
                    email: 'fried.richter@tgzoo.fr',
                    gender: 1
                }
            ],
            Animals: [
                {
                    id: 1,
                    name: 'Bagheera',
                    birthDate: '2010-01-11T22:00:00.000Z',
                    numberOfPaws: 4,
                    gender: 1,
                    childrenIdentifiers: [2, 3],
                    color: 'black',
                    isSpeckled: false,
                    status: 'Sick'
                },
                {
                    id: 2,
                    name: 'Jolene',
                    birthDate: '2017-03-10T22:00:00.000Z',
                    numberOfPaws: 4,
                    gender: 0,
                    color: 'blond',
                    isSpeckled: true,
                    status: 'Alive'
                },
                {
                    id: 3,
                    name: 'Ka',
                    birthDate: '2018-09-09T00:00:00.000Z',
                    numberOfPaws: 0,
                    gender: 1,
                    isPoisonous: true,
                    status: 'Alive'
                },
                {
                    id: 4,
                    name: 'Schrodinger',
                    numberOfPaws: 4,
                    gender: 1,
                    color: 'brown',
                    isSpeckled: false,
                    status: 'Dead and alive'
                }
            ],
            mascot: {
                id: 1,
                name: 'Bagheera',
                birthDate: '2010-01-11T22:00:00.000Z',
                numberOfPaws: 4,
                gender: 1,
                childrenIdentifiers: [2, 3],
                color: 'black',
                isSpeckled: false,
                status: 'Sick'
            },
            unknownAnimals: [
                {
                    name: null
                }
            ],
            phoneBook: {
                '1': {
                    value: '111-111-1111'
                },
                '2': {
                    value: '222-222-2222'
                },
                '3': {
                    value: '333-333-3333'
                }
            }
        },
        {
            id: 16,
            name: 'Zoo Zoo',
            city: 'Paris',
            coordinates: [4, 2, 3],
            country: 'France',
            boss: {
                id: 2,
                name: 'Sully',
                birthDate: '1984-08-03T22:00:00.000Z',
                email: 'sully.razowsky@tgzoo.fr',
                gender: 1
            },
            employees: [],
            Animals: [],
            mascot: null,
            unknownAnimals: []
        }
    ],
    mainShareholder: {
        id: 100,
        name: 'Elon Musk',
        birthDate: '1971-06-28T22:00:00.000Z',
        gender: 1
    },
    secondaryShareholder: null,
};
```

### Serialize & Deserialize

```typescript
// Import functions from library
import { deserialize, serialize } from 'typescript-json-serializer';

import { json } from '../json/data';
import { Organization } from '../models/organization';

// deserialize
const organization = deserialize<Organization>(json, Organization);

// serialize
const data = serialize(organization);
// or
const data = serialize(organization, false);
```

## Test

```sh
npm run test
# or
yarn test
```

## Author

Gillian Pérard - [@GillianPerard](https://github.com/GillianPerard)

## Contributors

* Hyeonsoo David Lee - [@civilizeddev](https://github.com/civilizeddev)
