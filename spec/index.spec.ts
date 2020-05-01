import 'reflect-metadata';

import { deserialize, serialize, JsonProperty, Serializable } from '../src';

import { Animal } from '../examples/models/animal';
import { Dummy } from '../examples/models/dummy';
import { Panther } from '../examples/models/panther';
import { Zoo } from '../examples/models/zoo';
import { data, deserializedData } from '../examples/json/data';
import { Organization } from '../examples/models/organization';

describe('Serializable', () => {
    it('should return false', () => {
        const hasMetadata = Reflect.hasOwnMetadata('api:map:serializable', Dummy);
        expect(hasMetadata).toBe(false);
    });

    it('should return true with one value', () => {
        const hasMetadata = Reflect.hasOwnMetadata('api:map:serializable', Animal);
        const metadata = Reflect.getOwnMetadata('api:map:serializable', Animal);
        expect(hasMetadata).toBe(true);
        expect(metadata).toEqual(['LivingBeing']);
    });

    it('should return true with multiple values', () => {
        const hasMetadata = Reflect.hasOwnMetadata('api:map:serializable', Panther);
        const metadata = Reflect.getOwnMetadata('api:map:serializable', Panther);
        expect(hasMetadata).toBe(true);
        expect(metadata).toEqual(['Animal', 'LivingBeing']);
    });
});

describe('serialize', () => {
    it('should return true', () => {
        expect(serialize(deserializedData)).toEqual(data);
    });

    it('should return 1 childrenIdentifiers', () => {
        const result = serialize(deserializedData, false);
        const count = result.zoos[0].Animals.filter((animal: any) => {
            return animal.hasOwnProperty('childrenIdentifiers');
        }).length;
        expect(count).toBe(1);
    });

    it('empty zoo should return an empty object', () => {
        const zoo = new Organization();
        expect(serialize(zoo)).toEqual({});
    });

    it('{} should return an empty object', () => {
        expect(serialize({})).toEqual({});
    });

    const organizationWithUndefinedValue = new Organization();
    organizationWithUndefinedValue.id = '4';
    organizationWithUndefinedValue.name = undefined;

    it('organizationWithUndefinedValue should return an object with undefined value', () => {
        expect(serialize(organizationWithUndefinedValue, false)).toEqual({
            id: '4',
            name: undefined
        });
    });

    it('organizationWithUndefinedValue should return an object without undefined value', () => {
        expect(serialize(organizationWithUndefinedValue)).toEqual({ id: '4' });
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
});
