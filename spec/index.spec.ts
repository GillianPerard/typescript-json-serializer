import 'reflect-metadata';

import { deserialize, serialize } from '../src';

import { data, deserializedData } from '../examples/json/data';
import { Animal } from '../examples/models/animal';
import { Dummy } from '../examples/models/dummy';
import { Organization } from '../examples/models/organization';
import { Panther } from '../examples/models/panther';
import { Zoo } from '../examples/models/zoo';
import { Employee } from '../examples/models/employee';

describe('Serializable', () => {
    it('should return false', () => {
        const hasMetadata = Reflect.hasOwnMetadata('api:map:serializable', Dummy);
        expect(hasMetadata).toBe(false);
    });

    it('should return true with no base class names and no options', () => {
        const hasMetadata = Reflect.hasOwnMetadata('api:map:serializable', Zoo);
        const metadata = Reflect.getOwnMetadata('api:map:serializable', Zoo);
        expect(hasMetadata).toBe(true);
        expect(metadata).toEqual({ baseClassNames: [], options: undefined });
    });

    it('should return true with 1 base class name and no options', () => {
        const hasMetadata = Reflect.hasOwnMetadata('api:map:serializable', Animal);
        const metadata = Reflect.getOwnMetadata('api:map:serializable', Animal);
        expect(hasMetadata).toBe(true);
        expect(metadata).toEqual({ baseClassNames: ['LivingBeing'], options: undefined });
    });

    it('should return true with 2 base class names and no options', () => {
        const hasMetadata = Reflect.hasOwnMetadata('api:map:serializable', Panther);
        const metadata = Reflect.getOwnMetadata('api:map:serializable', Panther);
        expect(hasMetadata).toBe(true);
        expect(metadata).toEqual({ baseClassNames: ['LivingBeing', 'Animal'], options: undefined });
    });

    it('should return true with 1 base class name and formatPropertyNames option', () => {
        const hasMetadata = Reflect.hasOwnMetadata('api:map:serializable', Organization);
        const metadata = Reflect.getOwnMetadata('api:map:serializable', Organization);
        expect(hasMetadata).toBe(true);
        expect(metadata.baseClassNames).toEqual(['Society']);
        expect(metadata?.options?.formatPropertyNames).not.toBeUndefined();
    });
});

describe('serialize', () => {
    it('should return true', () => {
        expect(serialize(deserializedData)).toEqual(data);
    });

    it('should return 1 childrenIdentifiers', () => {
        const result = serialize(deserializedData, false);
        const count = result.zoos
            .find((x: Zoo) => x.id === 15)
            .Animals.filter((animal: any) => {
                return animal.hasOwnProperty('childrenIdentifiers');
            }).length;
        expect(count).toBe(1);
    });

    it('empty organization should return an empty object', () => {
        const organization = new Organization();
        expect(serialize(organization)).toEqual({});
    });

    it('{} should return an empty object', () => {
        expect(serialize({})).toEqual({});
    });

    const organizationWithUndefinedValue = new Organization();
    organizationWithUndefinedValue.id = '4';
    const zoo = new Zoo();
    zoo.id = 2;
    organizationWithUndefinedValue.zoos = [zoo];

    it('organizationWithUndefinedValue should return an object with undefined value', () => {
        expect(serialize(organizationWithUndefinedValue, false)).toEqual({
            _id: '4',
            _name: undefined,
            zoos: [{ id: 2, name: undefined }]
        });
    });

    it('organizationWithUndefinedValue should return an object without undefined value', () => {
        expect(serialize(organizationWithUndefinedValue)).toEqual({ _id: '4', zoos: [{ id: 2 }] });
    });
});

describe('deserialize', () => {
    it('should return true', () => {
        expect(deserialize<Organization>(data, Organization)).toEqual(deserializedData);
    });

    it('should return true even if there are fake data included', () => {
        const alteredData = { ...data };
        alteredData['fake'] = 'fake';
        alteredData.zoos[0]['Animals'][0]['fake'] = 'fake';
        expect(deserialize<Organization>(alteredData, Organization)).toEqual(deserializedData);
    });

    it('should return an empty zoo (except for the isOpen property)', () => {
        const badData = {
            fake: 'fake'
        };
        expect(deserialize<Zoo>(badData, Zoo)).toEqual({ isOpen: true });
    });

    it('should return the right type', () => {
        const object = deserialize<Animal>({ name: 'My beautiful animal' }, Animal);
        const isAnimal = object instanceof Animal;
        expect(isAnimal).toBeTruthy();
    });

    it('should throw an error if required property is missing', () => {
        const fn = () => deserialize<Employee>(fried, Employee);
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
        const fn = () => deserialize<Employee>(fried, Employee);
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
        const fn = () => deserialize<Employee>(fried, Employee);
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
        const fn = () => deserialize<Employee>(fried, Employee);
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
});

describe('stringify/parse', () => {
    it('should return true', () => {
        const json = serialize(deserializedData);
        const jsonString = JSON.stringify(json, null, 4);
        const jsonObj = JSON.parse(jsonString);
        const obj = deserialize<Organization>(jsonObj, Organization);
        expect(obj).toEqual(deserializedData);
    });
});
