# typescript-json-serializer

![](https://github.com/GillianPerard/typescript-json-serializer/workflows/Build/badge.svg)
![npm](https://img.shields.io/npm/dt/typescript-json-serializer)
![npm bundle size (version)](https://img.shields.io/bundlephobia/minzip/typescript-json-serializer/3.4.4)
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

**WARNING:** If you use CRA (create-react-app) please refer to the [Using with Create React App](#using-with-create-react-app) section.

## Import

There are two decorators and two functions that you can import inside a typescript file.

```typescript
import {
    JsonProperty,
    Serializable,
    deserialize,
    serialize
} from 'typescript-json-serializer';
```

## Library

### Decorators

```typescript
// Serializable decorator set a class as serializable.
// It can take options as parameter:
// - formatPropertyNames function to format the property names
//   provided by the json you want to serialize to match
//   with your class property names

type FormatPropertyNameProto = (propertyName: string) => string;
type SerializableOptions = {
    formatPropertyNames: FormatPropertyNameProto
}

@Serializable(options?: SerializableOptions)
```

```typescript
// JsonProperty decorator set metadata to the property.
// It can take some optional parameters like:
// - the name of json property if diverge from the class property
//   (this value override the `formatPropertyNames` option from
//   `Serializable` decorator)
// - the type of the property (if needed)
// - a predicate function that return a type (if needed)
// - a function to transform data before serialize
// - a function to transform data after serialize
// - a function to transform data before deserialize
// - a function to transform data after deserialize
// - the names of properties to merge (the `formatPropertyNames`
//   from `Serializable` decorator is ignored)
// - a boolean to tell that the property is a dictionary
// - a boolean to tell that the property is required
//   (throw an error if undefined, null or missing)

// BREAKING CHANGES: since version 3.0.0
// - onSerialize has become afterSerialize
// - onDeserialize has become beforeDeserialize
// - postDeserialize has become afterDeserialize

type IOProto = (property: any, currentInstance?: any) => {};
type PredicateProto = (property: any, parentProperty?: any) => {};

@JsonProperty(args?:
    | string
    | {
        name?: string,
        type?: Function,
        beforeSerialize?: IOProto,
        afterSerialize?: IOProto,
        beforeDeserialize?: IOProto,
        afterDeserialize?: IOProto,
        isDictionary?: boolean,
        required?: boolean
      }
    | {
        name?: string,
        predicate?: PredicateProto,
        beforeSerialize?: IOProto,
        afterSerialize?: IOProto,
        beforeDeserialize?: IOProto,
        afterDeserialize?: IOProto,
        isDictionary?: boolean,
        required?: boolean
      }
    | {
        names?: Array<string>,
        type?: Function,
        beforeSerialize?: IOProto,
        afterSerialize?: IOProto,
        beforeDeserialize?: IOProto,
        afterDeserialize?: IOProto,
        required?: boolean
      }
    | {
        names?: Array<string>,
        predicate?: PredicateProto,
        beforeSerialize?: IOProto,
        afterSerialize?: IOProto,
        beforeDeserialize?: IOProto,
        afterDeserialize?: IOProto,
        required?: boolean
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
        // Override LivingBeing id property name
        // and set required to true
        @JsonProperty({name: 'humanId', required: true})
        public name: string,
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
    @JsonProperty({required: true}) email: string;

    /** Predicate function to determine if the property type
      * is PhoneNumber or a primitive type */
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
        // Override human id property name
        // (keep the require to true from Human id)
        @JsonProperty('employeeId') public id: number,
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


// Create a serializable class that extends Animal
// (which extends LivingBeing): Snake

@Serializable()
export class Snake extends Animal {

    @JsonProperty() isPoisonous: boolean;

    public constructor(name: string) {
        super(name);
    }

}


// Create a serializable empty class that extends Animal
// (which extends LivingBeing): UnknownAnimal

@Serializable()
export class UnknownAnimal extends Animal {
    public constructor(name: string) {
        super(name);
    }
}


// Create a serializable class: Zoo

// Function to transform coordinates into an array
const coordinatesToArray = (coordinates: {
    x: number;
    y: number;
    z: number;
}): Array<number> => {
    return Object.values(coordinates);
};

// Function to transform an array into coordinates
const arrayToCoordinates = (array: Array<number>): {
    x: number;
    y: number;
    z: number
} => {
    return {
        x: array[0],
        y: array[1],
        z: array[2]
    };
};

// A predicate function use to determine what is the
// right type of the data (Snake or Panther)
const snakeOrPanther = animal => {
    return animal && animal['isPoisonous'] !== undefined
        ? Snake
        : Panther;
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
    @JsonProperty({
        beforeDeserialize: arrayToCoordinates,
        afterSerialize: coordinatesToArray
    })
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

    // Dictionary of empty child classes
    @JsonProperty({ isDictionary: true, type: UnknownAnimal })
    unknownAnimals: { [id: string]: UnknownAnimal };

    // Dictionary of PhoneNumber or string
    @JsonProperty({
        isDictionary: true,
        predicate: property => {
            if (property && property.value !== undefined) {
                return PhoneNumber;
            }
        }
    })
    phoneBook: { [id: string]: PhoneNumber | string };

    // Property which will be not serialized and deserialized
    // but event accessible and editable from Zoo class.
    public isFree: boolean = true;

    public constructor() { }

}


// Create a serializable class that extends Society: Organization

const prefixWithUnderscore = (propertyName: string) => `_${propertyName}`

// Instead of defining the JsonProperty name for each property
// just use a function to do it for all of them.
// Warning: The properties of the base class will be formatted as well
@Serializable({ formatPropertyNames: prefixWithUnderscore })
export class Organization extends Society {
    // Override `formatPropertyNames`
    @JsonProperty({ name: 'zoos', type: Zoo }) zoos: Array<Zoo>;

    @JsonProperty({ isDictionary: true })
    zoosName: { [id: string]: string };

    // To merge multiple properties in a single one
    // use the property `names`.
    // If you don't create your own merge with the `beforeDeserialize`
    // and `afterSerialize` function, it will just merge properties
    // in this one when using `deserialize` and split back
    // when using `serialize`
    @JsonProperty({
        names: [
            '_mainShareholder',
            '_secondaryShareholder',
            '_thirdShareholder'
        ],
        type: Human,
        beforeDeserialize: value => Object.values(value),
        afterSerialize: value => {
            return {
                _mainShareholder: value[0],
                _secondaryShareholder: value[1],
                _thirdShareholder: value[2]
            };
        }
    })
    shareholders: Array<Human>;
}


// Create a serializable class: Society

@Serializable()
export class Organization {
    @JsonProperty() id: string;
    @JsonProperty() name: string;
}
```

### Json data

```typescript
// data.ts
export const data: any = {
    _id: '1',
    _name: 'Zoos Organization',
    _zoosName: {
        '15': 'The Greatest Zoo',
        '16': 'Zoo Zoo'
    },
    zoos: [
        {
            id: 15,
            name: 'The Greatest Zoo',
            city: 'Bordeaux',
            coordinates: [1, 2, 3],
            country: 'France',
            boss: {
                employeeId: 1,
                name: 'Bob Razowsky',
                birthDate: '1984-04-03T22:00:00.000Z',
                email: 'bob.razowsky@tgzoo.fr',
                gender: 1,
                phoneNumber: '111-111-1111'
            },
            employees: [
                {
                    employeeId: 1,
                    name: 'Bob Razowsky',
                    birthDate: '1984-04-03T22:00:00.000Z',
                    email: 'bob.razowsky@tgzoo.fr',
                    gender: 1,
                    phoneNumber: '111-111-1111'
                },
                {
                    employeeId: 2,
                    name: 'Mikasa Ackerman',
                    birthDate: '1984-01-11T22:00:00.000Z',
                    email: 'mikasa.ackerman@tgzoo.fr',
                    gender: 0,
                    phoneNumber: '222-222-2222'
                },
                {
                    employeeId: 3,
                    name: 'Red Redington',
                    birthDate: '1970-12-04T22:00:00.000Z',
                    email: 'red.redington@tgzoo.fr',
                    gender: 1,
                    phoneNumber: '333-333-3333'
                },
                {
                    employeeId: 4,
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
                    isPoisonous: true
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
            unknownAnimals: {
                '1': {
                    name: null
                }
            },
            phoneBook: {
                '1': {
                    value: '111-111-1111'
                },
                '2': {
                    value: '222-222-2222'
                },
                '3': '333-333-3333'
            }
        },
        {
            id: 16,
            name: 'Zoo Zoo',
            city: 'Paris',
            coordinates: [4, 2, 3],
            country: 'France',
            boss: {
                employeeId: 2,
                name: 'Sully',
                birthDate: '1984-08-03T22:00:00.000Z',
                email: 'sully.razowsky@tgzoo.fr',
                gender: 1,
                phoneNumber: {
                    countryCode: '33',
                    value: '0111111111'
                }
            },
            employees: [],
            Animals: [],
            mascot: null,
            unknownAnimals: {}
        }
    ],
    _mainShareholder: {
        humanId: 100,
        name: 'Elon Musk',
        birthDate: '1971-06-28T22:00:00.000Z',
        gender: 1
    },
    _secondaryShareholder: null
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

## Using with Create React App

If you are using [CRA](https://create-react-app.dev/) to create your React App you will need to add a custom configuration in order to add `Decorator` and `Metadata` features (not supported by React) using [customize-cra](https://github.com/arackaf/customize-cra) and [react-app-rewired](https://github.com/timarney/react-app-rewired/).

First, don't forget to add `emitDecoratorMetadata` and `experimentalDecorators` inside the `tsconfig.json` file (explain in the [Installation](#installation) section).

Next install the dependencies to override the React build config:

```sh
npm install -D customize-cra react-app-rewired
# or
yarn add -D customize-cra react-app-rewired
```

Replace the scripts using `react-scripts` in the `package.json` file by `react-app-rewired`:

```json
// example
{
    ...
    "scripts": {
        ...
        "start": "react-app-rewired start",
        "build": "react-app-rewired build",
        "test": "react-app-rewired test",
        "eject": "react-app-rewired eject"
        ...
    },
    ...
}
```

Install dependencies to add support for `Decorator` and `Metadata`:

```sh
npm install -D @babel/plugin-proposal-decorators \
@babel/preset-typescript \
babel-plugin-parameter-decorator \
babel-plugin-transform-typescript-metadata
# or
yarn add -D @babel/plugin-proposal-decorators \
@babel/preset-typescript \
babel-plugin-parameter-decorator \
babel-plugin-transform-typescript-metadata
```

Create the `config-overrides.js` file in the root of your project  
with the following content:

```js
const {
  override,
  addDecoratorsLegacy,
  addBabelPlugin,
  addBabelPreset,
} = require("customize-cra");

module.exports = override(
  addDecoratorsLegacy(),
  addBabelPlugin("babel-plugin-parameter-decorator"),
  addBabelPlugin("babel-plugin-transform-typescript-metadata"),
  addBabelPreset(["@babel/preset-typescript"])
);
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
