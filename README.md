# typescript-json-serializer

[![pipeline status](https://gitlab.com/gillian.perard/typescript-json-serializer/badges/master/pipeline.svg)](https://gitlab.com/gillian.perard/typescript-json-serializer/commits/master)
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
// It can take an optional parameter that specifies
// the name of the class extended.

@Serializable(baseClassName?: string)
```

```typescript
// JsonProperty decorator set metadata to the property.
// It can take some optional parameters like:
// - the name of json property
// - the type of the property (if needed)
// - a predicate function that return a type (if needed)
// - a function to transform data on deserialize
// - a function to transform data on serialize

@JsonProperty(args?: string
    | { name?: string, type?: Function, onDeserialize?: Function, onSerialize?: Function }
    | { name?: string, predicate?: Function, onDeserialize?: Function, onSerialize?: Function }
)
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
// zoo.ts

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


// Create a serializable class: Employee

// Serializable decorator
@Serializable()
export class Employee {

    /**
     * The employee's id (PK)
     */
    @JsonProperty()
    public id: number;

    /** The employee's email */
    @JsonProperty()
    public email: string;

    public constructor(
        // This comment works
        @JsonProperty() public name: string,
        @JsonProperty() public gender: Gender,
        /** This comment works */
        @JsonProperty() public readonly birthDate: Date
    ) { }

}


// Create a serializable class: Animal

@Serializable()
export class Animal {

    @JsonProperty()
    public id: number;
    @JsonProperty()
    public name: string;
    @JsonProperty()
    public birthDate: Date;
    @JsonProperty()
    public numberOfPaws: number;
    @JsonProperty()
    public gender: Gender;

    // Enum value (string)
    @JsonProperty()
    public status: Status;

    // Specify the property name of json property if needed
    @JsonProperty('childrenIdentifiers')
    public childrenIds: Array<number>;

    public constructor(name: string) {
        this.name = name;
    }

}


// Create a serializable class that extends Animal: Panther

// Serializable decorator where you need
// to specify if the class extends another
@Serializable('Animal')
export class Panther extends Animal {

    @JsonProperty() public color: string;

    // JsonProperty directly inside the constructor
    // for property parameters
    public constructor(
        @JsonProperty() public isSpeckled: boolean,
        name: string
    ) {
        super(name);
    }

}


// Create a serializable class that extends Animal: Snake

@Serializable('Animal')
export class Snake extends Animal {

    @JsonProperty()
    public isPoisonous: boolean;

    public constructor(name: string) {
        super(name);
    }

}


// Create a serializable empty class that extends Animal: UnknownAnimal

@Serializable('Animal')
export class UnknownAnimal extends Animal {
    public constructor(name: string) {
        super(name);
    }
}


// Create a serializable class: Zoo

// Function to transform coordinates into an array
const coordinatesToArray: Function = (coordinates: { x: number; y: number; z: number }): Array<number> => {
    return Object.values(coordinates);
};

// Function to transform an array into coordinates
const arrayToCoordinates: Function = (array: Array<number>): { x: number; y: number; z: number } => {
    return {
        x: array[0],
        y: array[1],
        z: array[2]
    };
};

// A predicate function use to determine what is the
// right type of the data (Snake or Panther)
const snakeOrPanther: Function = (animal: any): Function => {
    return animal['isPoisonous'] !== undefined ? Snake : Panther;
};

@Serializable()
export class Zoo {

    // Here you do not need to specify the type
    // inside the decorator
    @JsonProperty()
    public boss: Employee;

    @JsonProperty()
    public city: string;
    @JsonProperty()
    public country: string;

    // Property with transform functions executed respectively
    // on serialize and on deserialize
    @JsonProperty({ onDeserialize: arrayToCoordinates, onSerialize: coordinatesToArray })
    public coordinates: { x: number; y: number; z: number };

    // Array of none-basic type elements
    @JsonProperty({ type: Employee })
    public employees: Array<Employee>;

    @JsonProperty()
    public id: number;
    @JsonProperty()
    public name: string;

    // Array of none-basic type elements where you need to
    // specify the name of the json property
    // and use the predicate function to cast the deserialized
    // object into the correct child class
    @JsonProperty({ name: 'Animals', predicate: snakeOrPanther })
    public animals: Array<Animal>;

    // Property that can be Panther or Snake type
    // Use again the predicate function
    @JsonProperty({ predicate: snakeOrPanther })
    public mascot: Panther | Snake;

    // Array of empty child classes
    @JsonProperty({ type: UnknownAnimal })
    public unknownAnimals: Array<UnknownAnimal>;

    @JsonProperty()
    public bestEmployeeOfTheMonth: Employee;

    // Property which will be not serialized and deserialized
    // but event accessible and editable from Zoo class.
    public isFree: boolean = true;

    public constructor() { }

}
```

### Json data

```typescript
// data.ts
export const data: any = {
    'id': 15,
    'name': 'The Greatest Zoo',
    'city': 'Bordeaux',
    'coordinates': [1, 2, 3],
    'country': 'France',
    'boss': {
        'id': 1,
        'name': 'Bob Razowsky',
        'birthDate': '1984-04-03T22:00:00.000Z',
        'email': 'bob.razowsky@tgzoo.fr',
        'gender': 1
    },
    'employees': [
        {
            'id': 1,
            'name': 'Bob Razowsky',
            'birthDate': '1984-04-03T22:00:00.000Z',
            'email': 'bob.razowsky@tgzoo.fr',
            'gender': 1
        },
        {
            'id': 2,
            'name': 'Mikasa Ackerman',
            'birthDate': '1984-01-11T22:00:00.000Z',
            'email': 'mikasa.ackerman@tgzoo.fr',
            'gender': 0
        },
        {
            'id': 3,
            'name': 'Red Redington',
            'birthDate': '1970-12-04T22:00:00.000Z',
            'email': 'red.redington@tgzoo.fr',
            'gender': 1
        },
        {
            'id': 4,
            'name': 'Fried Richter',
            'birthDate': '1994-04-01T22:00:00.000Z',
            'email': 'fried.richter@tgzoo.fr',
            'gender': 1
        }
    ],
    'Animals': [
        {
            'id': 1,
            'name': 'Bagheera',
            'birthDate': '2010-01-11T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 1,
            'childrenIdentifiers': [2, 3],
            'color': 'black',
            'isSpeckled': false,
            'status': 'Sick'
        },
        {
            'id': 2,
            'name': 'Jolene',
            'birthDate': '2017-03-10T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 0,
            'color': 'blond',
            'isSpeckled': true,
            'status': 'Alive'
        },
        {
            'id': 3,
            'name': 'Ka',
            'birthDate': '2018-09-09T00:00:00.000Z',
            'numberOfPaws': 0,
            'gender': 1,
            'isPoisonous': true,
            'status': 'Alive'
        },
        {
            'id': 4,
            'name': 'Schrodinger',
            'birthDate': '2015-03-05T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 1,
            'color': 'brown',
            'isSpeckled': false,
            'status': 'Dead and alive'
        }
    ],
    'mascot': {
        'id': 1,
        'name': 'Bagheera',
        'birthDate': '2010-01-11T22:00:00.000Z',
        'numberOfPaws': 4,
        'gender': 1,
        'childrenIdentifiers': [2, 3],
        'color': 'black',
        'isSpeckled': false,
        'status': 'Sick'
    },
    'bestEmployeeOfTheMonth': undefined,
    'unknownAnimals': [{ 'name': 'Bob' }]
};
```

### Serialize & Deserialize

```typescript
// Import functions from library
import { deserialize, serialize } from 'typescript-json-serializer';

import { json } from '../json/data';
import { Zoo } from '../models/zoo';

// deserialize
const zoo: Zoo = deserialize<Zoo>(json, Zoo);

// serialize
const data: any = serialize(zoo);
// or
const data: any = serialize(zoo, false);

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
