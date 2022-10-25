# typescript-json-serializer

![](https://github.com/GillianPerard/typescript-json-serializer/workflows/Build/badge.svg)
![npm](https://img.shields.io/npm/dt/typescript-json-serializer)
![npm bundle size (version)](https://img.shields.io/bundlephobia/minzip/typescript-json-serializer/5.1.0)
[![Coverage Status](https://coveralls.io/repos/github/GillianPerard/typescript-json-serializer/badge.svg)](https://coveralls.io/github/GillianPerard/typescript-json-serializer)
[![Known Vulnerabilities](https://snyk.io/test/github/gillianperard/typescript-json-serializer/badge.svg?targetFile=package.json)](https://snyk.io/test/github/gillianperard/typescript-json-serializer?targetFile=package.json)

A typescript library to deserialize json into typescript classes and serialize classes into json.

## Summary

1. [Installation](#installation)
2. [Usage](#usage)
3. [API](#api)
4. [Development](#development)
5. [Thanks to](#thanks-to)

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

## Usage

```typescript
import { JsonSerializer, throwError } from 'typescript-json-serializer';

import { json } from '../json/data';
import { Organization } from '../models/organization';

// Instantiate a default serializer
const defaultSerializer = new JsonSerializer();

// Or you can instantiate a serializer with your custom options
const customSerializer = new JsonSerializer({
    // Throw errors instead of logging
    errorCallback: throwError,

    // Allow all nullish values
    nullishPolicy: {
        undefined: 'allow',
        null: 'allow'
    };

    // Disallow additional properties (non JsonProperty)
    additionalPropertiesPolicy: 'disallow'

    // e.g. if all the properties in the json object are prefixed by '_'
    formatPropertyName: (propertyName: string) => `_${propertyName}`;
})

// Deserialize
const organization = defaultSerializer.deserialize(json, Organization);

// Serialize
const data = defaultSerializer.serialize(organization);
```

### Examples

#### Classes

```typescript
// Import decorators from library
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

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

// Create a JsonObject class: LivingBeing

// JsonObject decorator
@JsonObject()
export class LivingBeing {

    /** The living being id (PK) */
    @JsonProperty() id: number;
}


// Create a JsonObject class that extends LivingBeing: Human

@JsonObject()
export class Human extends LivingBeing {
    constructor(
        // This comment works
        // Override LivingBeing id property name
        // and set required to true
        @JsonProperty({name: 'humanId', required: true})
        public id: number,
        @JsonProperty() public name: string,
        @JsonProperty() public gender: Gender,
        /** This comment works */
        @JsonProperty() public readonly birthDate: Date
    ) {
        super();
        this.id = id;
    }
}


// Create a JsonObject class: PhoneNumber

@JsonObject()
export class PhoneNumber {
    @JsonProperty() countryCode: string;
    @JsonProperty() value: string;
}


// Create a JsonObject class that extends Human: Employee

@JsonObject()
export class Employee extends Human {
    /** The employee's email */
    @JsonProperty({required: true}) email: string;

    /** Predicate function to determine if the property type
      * is PhoneNumber or a primitive type */
    @JsonProperty({
        type: property => {
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


// Create a JsonObject class: Animal

@JsonObject()
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


// Create a JsonObject class that extends Animal (which extends LivingBeing): Panther

@JsonObject()
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


// Create a JsonObject class that extends Animal
// (which extends LivingBeing): Snake

@JsonObject()
export class Snake extends Animal {

    @JsonProperty() isPoisonous: boolean;

    public constructor(args: { name: string; isPoisonous: boolean }) {
        super(args.name);
        this.isPoisonous = args.isPoisonous;
    }

}


// Create a JsonObject empty class that extends Animal
// (which extends LivingBeing): UnknownAnimal

@JsonObject()
export class UnknownAnimal extends Animal {
    public constructor(name: string) {
        super(name);
    }
}


// Create a JsonObject class: Zoo

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

@JsonObject()
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

    // Possibly undefined Set of none-basic type elements
    @JsonProperty({ type: Employee, dataStructure: 'set' })
    employees: Set<Employee> | undefined;

    @JsonProperty() id: number;
    @JsonProperty() name: string;

    // Array of none-basic type elements where you need to
    // specify the name of the json property
    // and use the predicate function to cast the deserialized
    // object into the correct child class
    @JsonProperty({ name: 'Animals', type: snakeOrPanther })
    animals: Array<Animal>;

    // Property that can be Panther or Snake type
    // Use again the predicate function
    @JsonProperty({ type: snakeOrPanther })
    mascot: Panther | Snake;

    // Map of empty child classes
    @JsonProperty({ type: UnknownAnimal })
    unknownAnimals: Map<string, UnknownAnimal>;

    // Dictionary of PhoneNumber or string
    @JsonProperty({
        dataStructure: 'dictionary',
        type: property => {
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

// Create a JsonObject generic class: Value

@JsonObject()
export class Value<R> {
    @JsonProperty() value: R;

    constructor(value: R) {
        this.value = value;
    }
}

// Create a JsonObject class: Item

@JsonObject()
export class Item {
    @JsonProperty({ name: 'name' })
    private readonly _name: string;

    @JsonProperty({ name: 'version' })
    private readonly _version: number;

    constructor(name: string, version: number) {
        this._name = name;
        this._version = version;
    }
}

// Create a JsonObject class that extends Society: Organization

@JsonObject()
export class Organization extends Society {
    @JsonProperty({ type: Zoo }) zoos: Array<Zoo>;
    @JsonProperty({ dataStructure: 'dictionary' })
    zoosName: { [id: string]: string };

    // To merge multiple properties in a single one
    // use the property `names`.
    // If you don't create your own merge with the `beforeDeserialize`
    // and `afterSerialize` function, it will just merge properties
    // in this one when using `deserialize` and split back
    // when using `serialize`
    @JsonProperty({
        name: [
            'mainShareholder',
            'secondaryShareholder',
            'thirdShareholder'
        ],
        type: Human,
        beforeDeserialize: value => Object.values(value),
        afterSerialize: value => {
            return {
                mainShareholder: value[0],
                secondaryShareholder: value[1],
                thirdShareholder: value[2]
            };
        }
    })
    shareholders: Array<Human>;
    miscellaneous: Value<Item>;
}


// Create a JsonObject class: Society

@JsonObject()
export class Society {
    @JsonProperty() id: string;
    @JsonProperty() name: string;
}
```

#### Json data

```typescript
// data.ts
export const data: any = {
    id: '1',
    name: 'Zoos Organization',
    zoosName: {
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
    mainShareholder: {
        humanId: 100,
        name: 'Elon Musk',
        birthDate: '1971-06-28T22:00:00.000Z',
        gender: 1
    },
    secondaryShareholder: null,
    miscellaneous: {
        value: {
            name: 'Item A',
            version: 1
        }
    }
};
```

## API

### Decorators

**@JsonObject()**   
Used to make a class serializable.

##### **Example**

```typescript
@JsonObject()
class MyClass {}
```

**@JsonProperty()**  
Used to make a class property serializable, property will be ignored if not set.

##### **Parameters**

**options**  
Type: `string` | [`JsonPropertyOptions`](#jsonpropertyoptions)  
Optional: `true`  
Description: The option to customize the serialization/deserialization of the target property.

##### **Example**

```typescript
@JsonProperty(options) myProperty: string;
```

### JsonSerializer

#### Constructor

```typescript
constructor(options?: Partial<JsonSerializerOptions>) {}
```

##### **Parameters**

**options**  
Type: <code>Partial<[JsonSerializerOptions](#jsonserializeroptions)></code>  
Optional: `true`  
Description: The options to customize the serializer.

#### Properties

**options**  
Type: <code>Partial<[JsonSerializerOptions](#jsonserializeroptions)></code>  
Optional: `false`  
Description: The options to customize the serializer.

Default value:

```typescript
{
    errorCallback: logError,
    nullishPolicy: {
        undefined: 'remove',
        null: 'allow'
    },
    additionalPropertiesPolicy: 'remove'
}
```

#### Methods

**deserialize()**  
To use when you don't know if the value to deserialize is an object or an array.

```typescript
deserialize<T extends object>(
    value: string | object | Array<object>,
    type: Type<T> | T
): T | Array<T|Nullish> | Nullish
```

##### **Parameters**

**value**  
Type: `string` | `object` | `Array<object>`  
Optional: `false`  
Description: The value to deserialize.

**type**  
Type: [`Type<T>`](#typet) | `T`  
Optional: `false`  
Description: The constructor class to deserialize into.

##### **Return**

`T` or <code>Array<T|[Nullish](#nullish)></code> or [`Nullish`](#nullish)

---

**deserializeObject()**  
To use when the value to deserialize is an object.

```typescript
deserializeObject<T extends object>(
    obj: string | object,
    type: Type<T> | T
): T | Nullish
```

##### **Parameters**

**obj**  
Type: `string` | `object`  
Optional: `false`  
Description: The object to deserialize.

**type**  
Type: [`Type<T>`](#typet) | `T`  
Optional: `false`  
Description: The constructor class to deserialize into.

##### **Return**

`T` or [`Nullish`](#nullish)

---

**deserializeObjectArray()**  
To use when the value to deserialize is an array.

```typescript
deserializeObjectArray<T extends object>(
    array: string | Array<any>,
    type: Type<T> | T
): Array<T|Nullish> | Nullish
```

##### **Parameters**

**array**  
Type: `string` | `Array<any>`  
Optional: `false`  
Description: The object to deserialize.

**type**  
Type: [`Type<T>`](#typet) | `T`  
Optional: `false`  
Description: The constructor class to deserialize into.

##### **Return**

<code>Array<T|[Nullish](#nullish)></code> or [`Nullish`](#nullish)

---

**serialize()**  
To use when you don't know if the value to serialize is an object or an array

```typescript
serialize(value: object | Array<object>): object | Array<object|Nullish> | Nullish
```

##### **Parameters**

**value**  
Type: `object` | `Array<object>`  
Optional: `false`  
Description: The object or the array of objects to serialize.

##### **Return**

`object` or <code>Array<object|[Nullish](#nullish)></code> or [`Nullish`](#nullish)

---

**serializeObject()**  
To use when the value to serialize is an object.

```typescript
serializeObject(instance: object): object | Nullish
```

##### **Parameters**

**instance**  
Type: `object`  
Optional: `false`  
Description: The object to serialize.

##### **Return**

`object` or [`Nullish`](#nullish)

---

**serializeObjectArray()**  
To use when the value to serialize is an array of objects.

```typescript
serializeObjectArray(array: Array<object>): Array<object|Nullish> | Nullish
```

##### **Parameters**

**array**  
Type: `Array<object>`  
Optional: `false`  
Description: The array of objects to serialize.

##### **Return**

<code>Array<object|[Nullish](#nullish)></code> or [`Nullish`](#nullish)

### Definitions

#### **Types**

##### **JsonPropertyOptions**

```typescript
name?: string | Array<string>;
type?: Function | PredicateProto;
dataStructure?: DataStructure;
required?: boolean;
beforeSerialize?: IOProto;
afterSerialize?: IOProto;
beforeDeserialize?: IOProto;
afterDeserialize?: IOProto;
```

##### **JsonSerializerOptions**

```typescript
errorCallback?: ErrorCallback = logError;
nullishPolicy: NullishPolicy = {
    undefined: 'remove',
    null: 'allow'
};
additionalPropertiesPolicy: Policy = 'remove';
formatPropertyName?: FormatPropertyNameProto;
```

##### **NullishPolicy**

```typescript
undefined: Policy;
null: Policy;
```

#### **Value types**

##### **DataStructure**

```typescript
'array' | 'dictionary' | 'map' | 'set'
```

##### **Nullish**

```typescript
null | undefined
```

##### **Policy**

```typescript
'allow' | 'disallow' | 'remove'
```

#### **Functions types**

##### **ErrorCallback**

```typescript
(message: string) => void
```

The library provide two built-in methods:

- `logError` that logs the error.
- `throwError` that throws the error.

##### **FormatPropertyNameProto**

```typescript
(propertyName: string) => string;
```

##### **IOProto**

```typescript
(property: any, currentInstance?: any) => any
```

##### **PredicateProto**

```typescript
(property: any, parentProperty?: any) => any
```

##### **Type\<T>**

```typescript
new (...args: Array<any>) => T;
```

Note: represent a `constructor`.

## Development

### Prerequisites

- NodeJS: [https://nodejs.org](https://nodejs.org/en/)
- Yarn: [https://yarnpkg.com](https://yarnpkg.com/)

### Install dependencies

```sh
yarn
```

### Run build

```sh
yarn build
```

### Run linter

```sh
yarn lint
```

### Run tests

```sh
yarn test
```

## Thanks to

### Author

Gillian Pérard - [@GillianPerard](https://github.com/GillianPerard)

### Contributors

* Hyeonsoo David Lee - [@civilizeddev](https://github.com/civilizeddev)
