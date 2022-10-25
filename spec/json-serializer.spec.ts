import 'reflect-metadata';
import { Animal, data, deserializedData, Employee, Gender, Organization, Zoo } from '../examples';
import {
    JsonObject,
    JsonProperty,
    JsonSerializer,
    JsonSerializerOptions,
    logError,
    throwError
} from '../src';

@JsonObject()
class WithAdditionalProperties {
    @JsonProperty() id: string;
    name: string;
}

describe('constructor', () => {
    it('should have default options', () => {
        const jsonSerializer = new JsonSerializer();
        const options: JsonSerializerOptions = {
            errorCallback: logError,
            nullishPolicy: {
                undefined: 'remove',
                null: 'allow'
            },
            additionalPropertiesPolicy: 'remove'
        };
        expect(jsonSerializer.options).toStrictEqual(options);
    });

    it('should override default options when pass new in param', () => {
        const options: Partial<JsonSerializerOptions> = {
            errorCallback: undefined,
            additionalPropertiesPolicy: 'disallow',
            formatPropertyName: (name: string) => `_${name}`
        };
        const overriddenOptions: JsonSerializerOptions = {
            errorCallback: undefined,
            nullishPolicy: {
                undefined: 'remove',
                null: 'allow'
            },
            additionalPropertiesPolicy: 'disallow',
            formatPropertyName: (name: string) => `_${name}`
        };
        const jsonSerializer = new JsonSerializer(options);
        expect(JSON.stringify(jsonSerializer.options)).toStrictEqual(
            JSON.stringify(overriddenOptions)
        );
    });
});

describe('serialize', () => {
    let jsonSerializer: JsonSerializer;

    beforeEach(() => {
        jsonSerializer = new JsonSerializer({ errorCallback: throwError });
    });

    describe('serialize', () => {
        it('should call the serializeObjectArray if param is an array', () => {
            const serializeObjectArray = jest.spyOn(jsonSerializer, 'serializeObjectArray');
            const result = jsonSerializer.serialize([]);
            expect(serializeObjectArray).toHaveBeenCalled();
            expect(result).toStrictEqual([]);
        });

        it('should call the serializeObject if param is an obj', () => {
            const serializeObject = jest.spyOn(jsonSerializer, 'serializeObject');
            const result = jsonSerializer.serialize({});
            expect(serializeObject).toHaveBeenCalled();
            expect(result).toStrictEqual({});
        });

        it('should return undefined if param is not an array nor an object', () => {
            jsonSerializer.options.errorCallback = logError;
            console.error = jest.fn();
            const value = 4 as any;
            const fn = () => jsonSerializer.serialize(value);
            const result = fn();
            expect(console.error).toHaveBeenCalled();
            expect(result).toStrictEqual(undefined);
        });
    });

    describe('serializeObject', () => {
        it('should return the serialized data', () => {
            const s = jsonSerializer.serializeObject(deserializedData);
            expect(s).toStrictEqual(data);
        });

        it('should return empty organization if serialized organization has no property set', () => {
            const organization = new Organization();
            expect(jsonSerializer.serializeObject(organization)).toStrictEqual({});
        });

        it('should return empty object for serialized empty object', () => {
            expect(jsonSerializer.serializeObject({})).toStrictEqual({});
        });

        it('should throw an error if required property is missing', () => {
            const fn = () => jsonSerializer.serializeObject(fried);
            const fried = new Employee('Fried Richter', 4, 1, new Date('1994-04-01T22:00:00.000Z'));
            expect(fn).toThrowError(
                `Fail to serialize: Property 'email' is required in Employee {"name":"Fried Richter","id":4,"gender":1,"birthDate":"1994-04-01T22:00:00.000Z"}.`
            );
        });

        it('should throw an error if required property is null', () => {
            const fn = () => jsonSerializer.serializeObject(fried);
            const fried = new Employee('Fried Richter', 4, 1, new Date('1994-04-01T22:00:00.000Z'));
            fried.email = null as any;
            expect(fn).toThrowError(
                `Fail to serialize: Property 'email' is required in Employee {"name":"Fried Richter","id":4,"gender":1,"birthDate":"1994-04-01T22:00:00.000Z","email":null}.`
            );
        });

        it('should throw an error if required property is undefined', () => {
            const fn = () => jsonSerializer.serializeObject(fried);
            const fried = new Employee('Fried Richter', 4, 1, new Date('1994-04-01T22:00:00.000Z'));
            fried.email = undefined as any;
            expect(fn).toThrowError(
                `Fail to serialize: Property 'email' is required in Employee {"name":"Fried Richter","id":4,"gender":1,"birthDate":"1994-04-01T22:00:00.000Z"}.`
            );
        });

        it('should throw an error if extended required property is missing', () => {
            const fn = () => jsonSerializer.serializeObject(fried);
            const fried = new Employee('Fried Richter', 4, 1, new Date('1994-04-01T22:00:00.000Z'));
            fried.email = 'fried.richter@tgzoo.fr';
            delete (fried as any).id;
            expect(fn).toThrowError(
                `Fail to serialize: Property 'id' is required in Employee {"name":"Fried Richter","gender":1,"birthDate":"1994-04-01T22:00:00.000Z","email":"fried.richter@tgzoo.fr"}.`
            );
        });
    });

    describe('serializeObjectArray', () => {
        beforeEach(() => (jsonSerializer.options.errorCallback = logError));

        it('should return the serialized array of data', () => {
            expect(
                jsonSerializer.serializeObjectArray([deserializedData, deserializedData])
            ).toStrictEqual([data, data]);
        });

        const test = (array: any, expected: any) => {
            jsonSerializer.options.nullishPolicy = {
                null: 'disallow',
                undefined: 'disallow'
            };
            console.error = jest.fn();
            const fn = () => jsonSerializer.serializeObjectArray(array);
            const result = fn();
            expect(console.error).toHaveBeenCalled();
            expect(result).toStrictEqual(expected);
        };

        it('should return null if param is null', () => {
            test(null, null);
        });

        it('should return undefined if param is undefined', () => {
            test(undefined, undefined);
        });

        it('should return undefined if param is not an array', () => {
            test(4, undefined);
        });
    });
});

describe('deserialize', () => {
    let jsonSerializer: JsonSerializer;

    beforeEach(() => {
        jsonSerializer = new JsonSerializer({ errorCallback: throwError });
    });

    describe('deserialize', () => {
        it('should return the deserialized object', () => {
            expect(jsonSerializer.deserialize(data, Organization)).toStrictEqual(deserializedData);
        });

        it('should return the deserialized object for json string', () => {
            const json = JSON.stringify(data);
            expect(jsonSerializer.deserialize(json, Organization)).toStrictEqual(deserializedData);
        });

        it('should return the deserialized object ignoring unknown properties', () => {
            const alteredData = { ...data };
            alteredData['fake'] = 'fake';
            alteredData.zoos[0]['Animals'][0]['fake'] = 'fake';
            expect(jsonSerializer.deserialize(alteredData, Organization)).toStrictEqual(
                deserializedData
            );
        });

        it('should return a zoo without properties except for the non-JsonProperty property', () => {
            const badData = {
                fake: 'fake'
            };
            expect(jsonSerializer.deserialize(badData, Zoo)).toStrictEqual(new Zoo());
        });

        it('should return the right object type', () => {
            const object = jsonSerializer.deserialize({ name: 'My beautiful animal' }, Animal);
            const isAnimal = object instanceof Animal;
            expect(isAnimal).toBeTruthy();
        });

        it('should return undefined property when dictionary is invalid', () => {
            const fn = () => jsonSerializer.deserialize(zoo, Zoo);
            const zoo: any = { name: 'zoo', phoneBook: 'test' };
            expect(fn).toThrowError(
                `Fail to deserialize: type 'string' is not assignable to type 'Dictionary'.\nReceived: "test".`
            );
            zoo.phoneBook = 4;
            expect(fn).toThrowError(
                `Fail to deserialize: type 'number' is not assignable to type 'Dictionary'.\nReceived: 4.`
            );
        });

        it('should return the deserialized array using deserialize method', () => {
            expect(jsonSerializer.deserialize(data.zoos, Zoo)).toStrictEqual(deserializedData.zoos);
        });

        it('should return undefined when deserialize undefined object with deserialize method', () => {
            const obj: any = undefined;
            const fn = () => jsonSerializer.deserialize(obj, Zoo);
            expect(fn).toThrowError(
                'Fail to deserialize: value is not an Array nor an Object.\nReceived: undefined.'
            );
        });

        it('should return null when deserialize null object with deserialize method', () => {
            const obj: any = null;
            const fn = () => jsonSerializer.deserialize(obj, Zoo);
            expect(fn).toThrowError(
                'Fail to deserialize: value is not an Array nor an Object.\nReceived: null.'
            );
        });
    });

    describe('deserializeObject', () => {
        it('should return the deserialized object', () => {
            expect(jsonSerializer.deserializeObject(data, Organization)).toStrictEqual(
                deserializedData
            );
        });

        const test = (obj: any, expected: any) => {
            jsonSerializer.options.errorCallback = logError;
            jsonSerializer.options.nullishPolicy = {
                null: 'disallow',
                undefined: 'disallow'
            };
            console.error = jest.fn();
            const fn = () => jsonSerializer.deserializeObject(obj, Zoo);
            const result = fn();
            expect(console.error).toHaveBeenCalled();
            expect(result).toStrictEqual(expected);
        };

        it('should return null when deserialize null object', () => {
            test(null, null);
        });

        it('should return undefined when deserialize undefined object', () => {
            test(undefined, undefined);
        });

        it('should return undefined when deserialize non object', () => {
            test(4, undefined);
        });

        it('should return zoo with isOpen already set to false', () => {
            const zoo = new Zoo();
            zoo.isOpen = false;
            const result = Object.assign(new Zoo(), deserializedData.zoos[0]);
            result.isOpen = false;
            expect(jsonSerializer.deserializeObject(data.zoos[0], zoo)).toStrictEqual(result);
        });

        it('should throw an error if required property is missing', () => {
            const fn = () => jsonSerializer.deserialize(fried, Employee);
            const fried = {
                employeeId: 4,
                name: 'Fried Richter',
                birthDate: '1994-04-01T22:00:00.000Z',
                gender: 1
            };
            expect(fn).toThrowError(
                `Fail to deserialize: Property 'email' is required in Employee {"employeeId":4,"name":"Fried Richter","birthDate":"1994-04-01T22:00:00.000Z","gender":1}.`
            );
        });

        it('should throw an error if required property is null', () => {
            const fn = () => jsonSerializer.deserialize(fried, Employee);
            const fried = {
                employeeId: 4,
                name: 'Fried Richter',
                birthDate: '1994-04-01T22:00:00.000Z',
                email: null,
                gender: 1
            };
            expect(fn).toThrowError(
                `Fail to deserialize: Property 'email' is required in Employee {"employeeId":4,"name":"Fried Richter","birthDate":"1994-04-01T22:00:00.000Z","email":null,"gender":1}.`
            );
        });

        it('should throw an error if required property is undefined', () => {
            const fn = () => jsonSerializer.deserialize(fried, Employee);
            const fried = {
                employeeId: 4,
                name: 'Fried Richter',
                birthDate: '1994-04-01T22:00:00.000Z',
                email: undefined,
                gender: 1
            };
            expect(fn).toThrowError(
                `Fail to deserialize: Property 'email' is required in Employee {"employeeId":4,"name":"Fried Richter","birthDate":"1994-04-01T22:00:00.000Z","gender":1}.`
            );
        });

        it('should throw an error if extended required property is missing', () => {
            const fn = () => jsonSerializer.deserialize(fried, Employee);
            const fried = {
                name: 'Fried Richter',
                birthDate: '1994-04-01T22:00:00.000Z',
                gender: 1,
                email: 'fried.richter@tgzoo.fr'
            };
            expect(fn).toThrowError(
                `Fail to deserialize: Property 'id' is required in Employee {"name":"Fried Richter","birthDate":"1994-04-01T22:00:00.000Z","gender":1,"email":"fried.richter@tgzoo.fr"}.`
            );
        });
    });

    describe('deserializeObjectArray', () => {
        it('should return the deserialized array', () => {
            expect(jsonSerializer.deserializeObjectArray(data.zoos, Zoo)).toStrictEqual(
                deserializedData.zoos
            );
        });

        const test = (array: any) => {
            jsonSerializer.options.errorCallback = logError;
            jsonSerializer.options.nullishPolicy = {
                null: 'disallow',
                undefined: 'disallow'
            };
            console.error = jest.fn();
            const fn = () => jsonSerializer.deserializeObjectArray(array, Zoo);
            const result = fn();
            expect(console.error).toHaveBeenCalled();
            expect(result).toStrictEqual(array);
        };

        it('should return undefined when deserialize undefined array', () => {
            test(undefined);
        });

        it('should return null when deserialize null array', () => {
            test(null);
        });
    });
});

describe('stringify/parse', () => {
    const jsonSerializer = new JsonSerializer();
    it('should serialize and deserialize correctly even if data are stringified and parsed manually from json', () => {
        const json = jsonSerializer.serializeObject(deserializedData);
        const jsonString = JSON.stringify(json, null, 4);
        const jsonObj = JSON.parse(jsonString);
        const obj = jsonSerializer.deserialize(jsonObj, Organization);
        expect(obj).toStrictEqual(deserializedData);
    });

    it('should serialize and deserialize correctly even if data are stringified manually from json and parsed by deserialize function', () => {
        const json = jsonSerializer.serializeObject(deserializedData);
        const jsonString = JSON.stringify(json, null, 4) as any;
        let obj = jsonSerializer.deserialize(jsonString, Organization);
        expect(obj).toStrictEqual(deserializedData);
        obj = jsonSerializer.deserializeObject(jsonString, Organization);
        expect(obj).toStrictEqual(deserializedData);
    });
});

describe('formatPropertyName', () => {
    const jsonEmployee: any = {
        employeeId: 4,
        _name: 'test',
        _email: 'test@test.com',
        _gender: Gender.Female,
        _birthDate: '2021-07-21T12:55:55.790Z'
    };
    const employee = new Employee('test', 4, Gender.Female, new Date('2021-07-21T12:55:55.790Z'));
    employee.email = 'test@test.com';
    const prefixedFormat = (propertyName: string) => `_${propertyName}`;

    const jsonSerializer = new JsonSerializer({
        formatPropertyName: prefixedFormat
    });

    it('should deserialize without underscore', () => {
        expect(jsonSerializer.deserialize(jsonEmployee, Employee)).toStrictEqual(employee);
    });

    it('should serialize with underscore', () => {
        expect(jsonSerializer.serializeObject(employee)).toStrictEqual(jsonEmployee);
    });
});

describe('allowedAdditionalProperties', () => {
    let jsonSerializer: JsonSerializer;
    let obj: any;
    let instance: WithAdditionalProperties;

    beforeEach(() => {
        jsonSerializer = new JsonSerializer({ errorCallback: throwError });
        obj = {
            id: 'bb34c00b-af82-4c27-98c2-766c738796b8'
        };
        instance = new WithAdditionalProperties();
        instance.id = 'bb34c00b-af82-4c27-98c2-766c738796b8';
    });

    describe('deserialize', () => {
        beforeEach(() => {
            obj.name = 'test';
            obj.age = 20;
        });

        it('should remove additional properties', () => {
            expect(jsonSerializer.deserialize(obj, WithAdditionalProperties)).toStrictEqual(
                instance
            );
        });

        it('should keep additional properties', () => {
            jsonSerializer.options.additionalPropertiesPolicy = 'allow';
            instance.name = 'test';
            (instance as any).age = 20;
            expect(jsonSerializer.deserialize(obj, WithAdditionalProperties)).toStrictEqual(
                instance
            );
        });

        it('should throw an error additional properties', () => {
            jsonSerializer.options.additionalPropertiesPolicy = 'disallow';
            const fn = () => jsonSerializer.deserialize(obj, WithAdditionalProperties);
            expect(fn).toThrowError(
                'Additional properties detected in {"id":"bb34c00b-af82-4c27-98c2-766c738796b8","name":"test","age":20}: name,age.'
            );
        });
    });

    describe('serialize', () => {
        beforeEach(() => {
            instance.name = 'test';
            (instance as any).age = 20;
        });

        it('should remove additional properties', () => {
            expect(jsonSerializer.serialize(instance)).toStrictEqual(obj);
        });

        it('should keep additional properties', () => {
            jsonSerializer.options.additionalPropertiesPolicy = 'allow';
            obj.name = 'test';
            obj.age = 20;
            expect(jsonSerializer.serialize(instance)).toStrictEqual(obj);
        });

        it('should throw an error additional properties', () => {
            jsonSerializer.options.additionalPropertiesPolicy = 'disallow';
            const fn = () => jsonSerializer.serialize(instance);
            expect(fn).toThrowError(
                'Additional properties detected in {"id":"bb34c00b-af82-4c27-98c2-766c738796b8","name":"test","age":20}: name,age.'
            );
        });
    });
});
