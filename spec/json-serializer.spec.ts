import 'reflect-metadata';
import { JsonSerializer, JsonSerializerOptions, logError, throwError } from '../src';
import { data, deserializedData, Animal, Organization, Zoo, Employee, Gender } from '../examples';

describe('constructor', () => {
    it('should have default options', () => {
        const jsonSerializer = new JsonSerializer();
        const options: JsonSerializerOptions = {
            errorCallback: logError,
            nullishPolicy: {
                undefined: 'remove',
                null: 'allow'
            }
        };
        expect(jsonSerializer.options).toEqual(options);
    });

    it('should override default options when pass new in param', () => {
        const options: Partial<JsonSerializerOptions> = {
            errorCallback: undefined,
            formatPropertyName: (name: string) => `_${name}`
        };
        const overriddenOptions: JsonSerializerOptions = {
            errorCallback: undefined,
            nullishPolicy: {
                undefined: 'remove',
                null: 'allow'
            },
            formatPropertyName: (name: string) => `_${name}`
        };
        const jsonSerializer = new JsonSerializer(options);
        expect(JSON.stringify(jsonSerializer.options)).toEqual(JSON.stringify(overriddenOptions));
    });
});

describe('serialize', () => {
    const jsonSerializer = new JsonSerializer({ errorCallback: throwError });

    it('should return the serialized data', () => {
        expect(jsonSerializer.serializeObject(deserializedData)).toEqual(data);
    });

    it('should return the serialized array of data', () => {
        expect(jsonSerializer.serializeObjectArray([deserializedData, deserializedData])).toEqual([
            data,
            data
        ]);
    });

    it('should return empty organization if serialized organization has no property set', () => {
        const organization = new Organization();
        expect(jsonSerializer.serializeObject(organization)).toEqual({});
    });

    it('should return empty object for serialized empty object', () => {
        expect(jsonSerializer.serializeObject({})).toEqual({});
    });
});

describe('deserialize', () => {
    const jsonSerializer = new JsonSerializer({ errorCallback: throwError });

    it('should return the deserialized object using deserialize method', () => {
        expect(jsonSerializer.deserialize(data, Organization)).toEqual(deserializedData);
    });

    it('should return the deserialized object using deserializeObject method', () => {
        expect(jsonSerializer.deserializeObject(data, Organization)).toEqual(deserializedData);
    });

    it('should return the deserialized object for json string', () => {
        const json = JSON.stringify(data);
        expect(jsonSerializer.deserialize(json, Organization)).toEqual(deserializedData);
    });

    it('should return the deserialized object ignoring unknown properties', () => {
        const alteredData = { ...data };
        alteredData['fake'] = 'fake';
        alteredData.zoos[0]['Animals'][0]['fake'] = 'fake';
        expect(jsonSerializer.deserialize(alteredData, Organization)).toEqual(deserializedData);
    });

    it('should return object without properties except for the non-JsonProperty property', () => {
        const badData = {
            fake: 'fake'
        };
        expect(jsonSerializer.deserialize(badData, Zoo)).toEqual({ isOpen: true });
    });

    it('should return the right object type', () => {
        const object = jsonSerializer.deserialize({ name: 'My beautiful animal' }, Animal);
        const isAnimal = object instanceof Animal;
        expect(isAnimal).toBeTruthy();
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
            `Property 'email' is required in Employee {"employeeId":4,"name":"Fried Richter","birthDate":"1994-04-01T22:00:00.000Z","gender":1}.`
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
            `Property 'email' is required in Employee {"employeeId":4,"name":"Fried Richter","birthDate":"1994-04-01T22:00:00.000Z","email":null,"gender":1}.`
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
            `Property 'email' is required in Employee {"employeeId":4,"name":"Fried Richter","birthDate":"1994-04-01T22:00:00.000Z","gender":1}.`
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
            `Property 'id' is required in Employee {"name":"Fried Richter","birthDate":"1994-04-01T22:00:00.000Z","gender":1,"email":"fried.richter@tgzoo.fr"}.`
        );
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
        expect(jsonSerializer.deserialize(data.zoos, Zoo)).toEqual(deserializedData.zoos);
    });

    it('should return the deserialized array using deserializeObjectArray method', () => {
        expect(jsonSerializer.deserializeObjectArray(data.zoos, Zoo)).toEqual(
            deserializedData.zoos
        );
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

    it('should return undefined when deserialize undefined object with deserializeObject method', () => {
        const obj: any = undefined;
        expect(jsonSerializer.deserializeObjectArray(obj, Zoo)).toBeUndefined();
    });

    it('should return null when deserialize null object with deserializeObject method', () => {
        const obj: any = null;
        expect(jsonSerializer.deserializeObject(obj, Zoo)).toBeNull();
    });

    it('should return undefined when deserialize undefined array with deserializeObjectArray method', () => {
        const obj: any = undefined;
        expect(jsonSerializer.deserializeObjectArray(obj, Zoo)).toBeUndefined();
    });

    it('should return null when deserialize null array with deserializeObjectArray method', () => {
        const obj: any = null;
        expect(jsonSerializer.deserializeObjectArray(obj, Zoo)).toBeNull();
    });
});

describe('stringify/parse', () => {
    const jsonSerializer = new JsonSerializer();
    it('should serialize and deserialize correctly even if data are stringified and parsed manually from json', () => {
        const json = jsonSerializer.serializeObject(deserializedData);
        const jsonString = JSON.stringify(json, null, 4);
        const jsonObj = JSON.parse(jsonString);
        const obj = jsonSerializer.deserialize(jsonObj, Organization);
        expect(obj).toEqual(deserializedData);
    });

    it('should serialize and deserialize correctly even if data are stringified manually from json and parsed by deserialize function', () => {
        const json = jsonSerializer.serializeObject(deserializedData);
        const jsonString = JSON.stringify(json, null, 4) as any;
        let obj = jsonSerializer.deserialize(jsonString, Organization);
        expect(obj).toEqual(deserializedData);
        obj = jsonSerializer.deserializeObject(jsonString, Organization);
        expect(obj).toEqual(deserializedData);
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
        expect(jsonSerializer.deserialize(jsonEmployee, Employee)).toEqual(employee);
    });

    it('should serialize with underscore', () => {
        expect(jsonSerializer.serializeObject(employee)).toEqual(jsonEmployee);
    });
});
