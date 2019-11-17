import 'reflect-metadata';

import { deserialize, serialize } from '../src';

import { Animal } from '../examples/models/animal';
import { Dummy } from '../examples/models/dummy';
import { Panther } from '../examples/models/panther';
import { Zoo } from '../examples/models/zoo';

import { data, deserializedData } from '../examples/json/data';

describe('Serializable', () => {
    it('should return false', () => {
        const hasMetadata: boolean = Reflect.hasOwnMetadata('api:map:serializable', Dummy);
        expect(hasMetadata).toBe(false);
    });

    it('should return true without value', () => {
        const hasMetadata: boolean = Reflect.hasOwnMetadata('api:map:serializable', Zoo);
        const metadata: any = Reflect.getOwnMetadata('api:map:serializable', Zoo);
        expect(hasMetadata).toBe(true);
        expect(metadata).toBe(undefined);
    });

    it('should return true with value', () => {
        const hasMetadata: boolean = Reflect.hasOwnMetadata('api:map:serializable', Panther);
        const metadata: any = Reflect.getOwnMetadata('api:map:serializable', Panther);
        expect(hasMetadata).toBe(true);
        expect(metadata).toBe('Animal');
    });
});

describe('serialize', () => {
    it('should return true', () => {
        expect(serialize(deserializedData)).toEqual(data);
    });

    it('should return 1 childrenIdentifiers', () => {
        const result: any = serialize(deserializedData, false);
        const count: number = result.Animals.filter((animal: any) => {
            return animal.hasOwnProperty('childrenIdentifiers');
        }).length;
        expect(count).toBe(1);
    });

    it('empty zoo should return an empty object', () => {
        const zoo: Zoo = new Zoo();
        expect(serialize(zoo)).toEqual({});
    });

    it('{} should return an empty object', () => {
        expect(serialize({})).toEqual({});
    });

    const zooWithUndefinedValue: Zoo = new Zoo();
    zooWithUndefinedValue.id = 4;
    zooWithUndefinedValue.name = undefined;

    it('zooWithUndefinedValue should return an object with undefined value', () => {
        expect(serialize(zooWithUndefinedValue, false)).toEqual({ id: 4, name: undefined });
    });

    it('zooWithUndefinedValue should return an object without undefined value', () => {
        expect(serialize(zooWithUndefinedValue)).toEqual({ id: 4 });
    });
});

describe('deserialize', () => {
    it('should return true', () => {
        expect(deserialize(data, Zoo)).toEqual(deserializedData);
    });

    it('should return true even if there are fake data included', () => {
        const alteredData: any = { ...data };
        alteredData['fake'] = 'fake';
        alteredData['Animals'][0]['fake'] = 'fake';
        expect(deserialize(alteredData, Zoo)).toEqual(deserializedData);
    });

    it('should return an empty zoo (except for the isOpen property)', () => {
        const badData: any = {
            fake: 'fake'
        };
        expect(deserialize(badData, Zoo)).toEqual({ isOpen: true });
    });

    it('should return the right type', () => {
        const object: any = deserialize({ name: 'My beautiful animal' }, Animal);
        const isAnimal: boolean = object instanceof Animal;
        expect(isAnimal).toBeTruthy();
    });
});
