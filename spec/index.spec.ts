import 'reflect-metadata';

import { deserialize, serialize } from '../src';

import { data, deserializedData } from '../examples/json/data';
import { Animal } from '../examples/models/animal';
import { Dummy } from '../examples/models/dummy';
import { Organization } from '../examples/models/organization';
import { Panther } from '../examples/models/panther';
import { Zoo } from '../examples/models/zoo';
import { Employee } from '../examples/models/employee';

describe('JsonObject', () => {
    it('should return no metadata', () => {
        const hasMetadata = Reflect.hasOwnMetadata('api:map:jsonObject', Dummy);
        expect(hasMetadata).toBe(false);
    });

    it('should return metadata with no base class names and no options', () => {
        const hasMetadata = Reflect.hasOwnMetadata('api:map:jsonObject', Zoo);
        const metadata = Reflect.getOwnMetadata('api:map:jsonObject', Zoo);
        expect(hasMetadata).toBe(true);
        expect(metadata).toEqual({ baseClassNames: [], options: undefined });
    });

    it('should return metadata with 1 base class name and no options', () => {
        const hasMetadata = Reflect.hasOwnMetadata('api:map:jsonObject', Animal);
        const metadata = Reflect.getOwnMetadata('api:map:jsonObject', Animal);
        expect(hasMetadata).toBe(true);
        expect(metadata).toEqual({ baseClassNames: ['LivingBeing'], options: undefined });
    });

    it('should return metadata with 2 base class names and no options', () => {
        const hasMetadata = Reflect.hasOwnMetadata('api:map:jsonObject', Panther);
        const metadata = Reflect.getOwnMetadata('api:map:jsonObject', Panther);
        expect(hasMetadata).toBe(true);
        expect(metadata).toEqual({ baseClassNames: ['LivingBeing', 'Animal'], options: undefined });
    });

    it('should return metadata with 1 base class name and formatPropertyNames option', () => {
        const hasMetadata = Reflect.hasOwnMetadata('api:map:jsonObject', Organization);
        const metadata = Reflect.getOwnMetadata('api:map:jsonObject', Organization);
        expect(hasMetadata).toBe(true);
        expect(metadata.baseClassNames).toEqual(['Society']);
        expect(metadata?.options?.formatPropertyNames).not.toBeUndefined();
    });
});

describe('serialize', () => {
    it('should return the serialized data', () => {
        expect(serialize(deserializedData)).toEqual(data);
    });

    it('should have 1 childrenIdentifiers in the Great Zoo', () => {
        const result = serialize(deserializedData, false);
        const count = result.zoos
            .find((x: Zoo) => x.id === 15)
            .Animals.filter((animal: any) => animal.hasOwnProperty('childrenIdentifiers')).length;
        expect(count).toBe(1);
    });

    it('should return empty organization if serialized organization has no property set', () => {
        const organization = new Organization();
        expect(serialize(organization)).toEqual({});
    });

    it('should return empty object for serialized empty object', () => {
        expect(serialize({})).toEqual({});
    });

    const organizationWithUndefinedValue = new Organization();
    organizationWithUndefinedValue.id = '4';
    const zoo = new Zoo();
    zoo.id = 2;
    organizationWithUndefinedValue.zoos = [zoo];

    it('should have undefined value if removeUndefined param is false', () => {
        expect(serialize(organizationWithUndefinedValue, false)).toEqual({
            _id: '4',
            _name: undefined,
            zoos: [{ id: 2, name: undefined }]
        });
    });

    it('should not have undefined value if removeUndefined param is not set', () => {
        expect(serialize(organizationWithUndefinedValue)).toEqual({
            _id: '4',
            zoos: [{ id: 2 }]
        });
    });
});

describe('deserialize', () => {
    it('should return the deserialized object', () => {
        expect(deserialize(data, Organization)).toEqual(deserializedData);
    });

    it('should return the deserialized object for json string', () => {
        const json = JSON.stringify(data);
        expect(deserialize(json, Organization)).toEqual(deserializedData);
    });

    it('should return the deserialized object ignoring unknown properties', () => {
        const alteredData = { ...data };
        alteredData['fake'] = 'fake';
        alteredData.zoos[0]['Animals'][0]['fake'] = 'fake';
        expect(deserialize(alteredData, Organization)).toEqual(deserializedData);
    });

    it('should return object without properties except for the non-JsonProperty property', () => {
        const badData = {
            fake: 'fake'
        };
        expect(deserialize(badData, Zoo)).toEqual({ isOpen: true });
    });

    it('should return the right object type', () => {
        const object = deserialize({ name: 'My beautiful animal' }, Animal);
        const isAnimal = object instanceof Animal;
        expect(isAnimal).toBeTruthy();
    });

    it('should throw an error if required property is missing', () => {
        const fn = () => deserialize(fried, Employee);
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
        const fn = () => deserialize(fried, Employee);
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
        const fn = () => deserialize(fried, Employee);
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
        const fn = () => deserialize(fried, Employee);
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
        const zoo: any = { name: 'zoo', phoneBook: 'test' };
        let dZoo = deserialize(zoo, Zoo);
        expect(dZoo.phoneBook).toBeUndefined();
        zoo.phoneBook = undefined;
        dZoo = deserialize(zoo, Zoo);
        expect(dZoo.phoneBook).toBeUndefined();
        zoo.phoneBook = 4;
        dZoo = deserialize(zoo, Zoo);
        expect(dZoo.phoneBook).toBeUndefined();
    });
});

describe('stringify/parse', () => {
    it('should serialize and deserialize correctly even if data are stringified and parsed manually from json', () => {
        const json = serialize(deserializedData);
        const jsonString = JSON.stringify(json, null, 4);
        const jsonObj = JSON.parse(jsonString);
        const obj = deserialize(jsonObj, Organization);
        expect(obj).toEqual(deserializedData);
    });

    it('should serialize and deserialize correctly even if data are stringified manually from json and parsed by deserialize function', () => {
        const json = serialize(deserializedData);
        const jsonString = JSON.stringify(json, null, 4);
        const obj = deserialize(jsonString, Organization);
        expect(obj).toEqual(deserializedData);
    });
});
