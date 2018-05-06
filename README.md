# typescript-json-serializer

[![Build Status](https://travis-ci.org/GillianPerard/typescript-json-serializer.svg?branch=master)](https://travis-ci.org/GillianPerard/typescript-json-serializer)
[![Coverage Status](https://coveralls.io/repos/github/GillianPerard/typescript-json-serializer/badge.svg)](https://coveralls.io/github/GillianPerard/typescript-json-serializer)
[![Known Vulnerabilities](https://snyk.io/test/github/gillianperard/typescript-json-serializer/badge.svg?targetFile=package.json)](https://snyk.io/test/github/gillianperard/typescript-json-serializer?targetFile=package.json)

A typescript library to deserialize json into typescript classes and serialize classes into json.

## Installation

```sh
npm install typescript-json-serializer --save
```

You also need to set **experimentalDecorators** and **emitDecoratorMetadata** to true into the tsconfig.json file.

For example:

```json
{
    "compileOnSave": false,
    "compilerOptions": {
        "outDir": "./dist",
        "sourceMap": false,
        "declaration": true,
        "moduleResolution": "node",
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "target": "es5",
        "typeRoots": [
            "node_modules/@types"
        ],
        "lib": [
            "es2015",
            "dom"
        ]
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
// It can take an optionnal parameter that specifies
// the name of the class extended.

@Serializable(baseClassName?: string)
```

```typescript
// JsonProperty decorator set metadata to the property.
// It can take some optionnal parameters like the name of json property
// or the type of the property (if needed).

@JsonProperty(args?: string | { name?: string, type: Function })
```

### Functions

```typescript
// serialize function transform typescript class into json.
// It takes two parameters:
// - a instance of the class to serialize
// - a boolean to remove undefined property (default true)

serialize(instance: any, removeUndefined: boolean = true)
```

```typescript
// deserialize function transform json into typescript class.
// It takes two parameters:
// - json data
// - the class you want to deserialize into

deserialize(json: any, type: any)
```

## Example

### Classes

```typescript
// zoo.ts

// Import decorators from library
import { Serializable, JsonProperty } from './../../src';

// Enums
export enum Gender {
    female,
    male,
    other
}

export enum Status {
    alive = 'Alive',
    sick = 'Sick',
    deadAndAlive = 'Dead and alive',
    dead = 'Dead'
}


// Create a serializable class: Employee

// Serializable decorator
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

    // Enum value (number)
    @JsonProperty()
    public gender: Gender;

    public constructor() { }

}


// Create a serializable class: Animal

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
    public gender: Gender;

    // Enum value (string)
    @JsonProperty()
    public status: Status;

    // Specify the property name of json property if needed
    @JsonProperty('childrenIdentifiers')
    public childrenIds: Array<number>;

    public constructor() { }

}


// Create a serializable class that extends Animal: Panther

// Serializable decorator where you need
// to specify if the class extends another
@Serializable('Animal')
export class Panther extends Animal {

    @JsonProperty()
    public color: string;
    @JsonProperty()
    public isSpeckled: boolean;

    public constructor() {
        super();
    }

}


// Create a serializable class: Zoo

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

    // Array of none-basic type elements
    @JsonProperty({ type: Employee })
    public employees: Array<Employee>;

    @JsonProperty()
    public id: number;
    @JsonProperty()
    public name: string;

    // Array of none-basic type elements where you need to
    // specify the name of the json property
    @JsonProperty({ name: 'Panthers', type: Panther })
    public panthers: Array<Panther>;

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
    'country': 'France',
    'boss': {
        'id': 1,
        'name': 'Bob Razowsky',
        'birthdate': '1984-04-03T22:00:00.000Z',
        'email': 'bob.razowsky@tgzoo.fr',
        'gender': 1
    },
    'employees': [
        {
            'id': 1,
            'name': 'Bob Razowsky',
            'birthdate': '1984-04-03T22:00:00.000Z',
            'email': 'bob.razowsky@tgzoo.fr',
            'gender': 1
        },
        {
            'id': 2,
            'name': 'Mikasa Ackerman',
            'birthdate': '1984-01-11T22:00:00.000Z',
            'email': 'mikasa.ackerman@tgzoo.fr',
            'gender': 0
        },
        {
            'id': 3,
            'name': 'Red Redington',
            'birthdate': '1970-12-04T22:00:00.000Z',
            'email': 'red.redington@tgzoo.fr',
            'gender': 1
        },
        {
            'id': 4,
            'name': 'Fried Richter',
            'birthdate': '1994-04-01T22:00:00.000Z',
            'email': 'fried.richter@tgzoo.fr',
            'gender': 1
        }
    ],
    'Panthers': [
        {
            'id': 1,
            'name': 'Bagheera',
            'birthdate': '2010-01-11T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 1,
            'childrenIdentifiers': [
                2,
                3
            ],
            'color': 'black',
            'isSpeckled': false,
            'status': 'Sick'
        },
        {
            'id': 2,
            'name': 'Jolene',
            'birthdate': '2017-03-10T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 0,
            'color': 'blond',
            'isSpeckled': true,
            'status': 'Alive'
        },
        {
            'id': 3,
            'name': 'Schrodinger',
            'birthdate': '2015-03-05T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 1,
            'color': 'brown',
            'isSpeckled': false,
            'status': 'Dead and alive'
        }
    ]
};
```

### Serialize & Deserialize

```typescript
// Import functions from library
import { deserialize, serialize } from 'typescript-json-serializer';

import { json } from '../json/data';
import { Zoo } from '../models/zoo';

// deserialize
const zoo: Zoo = deserialize(json, Zoo);

// serialize
const data: any = serialize(zoo);
// or
const data: any = serialize(zoo, false);

```

## Test

```sh
npm run test
```