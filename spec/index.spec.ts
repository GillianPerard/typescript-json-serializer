import { expect } from 'chai';
import 'reflect-metadata';
import * as rewire from 'rewire';

import { deserialize, serialize } from '../src/index';

import { Dummy } from '../examples/models/dummy';
import { Panther } from '../examples/models/panther';
import { Zoo } from '../examples/models/zoo';

import { data, deserializedData } from '../examples/json/data';

const tjs: any = rewire('../src/index');

describe('Serializable', () => {

    it('should return false', () => {
        const hasMetadata: boolean = Reflect.hasOwnMetadata('api:map:serializable', Dummy);
        expect(hasMetadata).to.equal(false);
    });

    it('should return true without value', () => {
        const hasMetadata: boolean = Reflect.hasOwnMetadata('api:map:serializable', Zoo);
        const metadata: any = Reflect.getOwnMetadata('api:map:serializable', Zoo);
        expect(hasMetadata).to.equal(true);
        expect(metadata).to.equal(undefined);
    });

    it('should return true with value', () => {
        const hasMetadata: boolean = Reflect.hasOwnMetadata('api:map:serializable', Panther);
        const metadata: any = Reflect.getOwnMetadata('api:map:serializable', Panther);
        expect(hasMetadata).to.equal(true);
        expect(metadata).to.equal('Animal');
    });
});

describe('serialize', () => {
    it('should return true', () => {
        expect(serialize(deserializedData)).to.deep.equal(data);
    });

    it('should return 1 childrenIdentifiers', () => {
        const result: any = serialize(deserializedData, false);
        const count: number = result.Animals.filter((animal: any) => {
            return (animal.hasOwnProperty('childrenIdentifiers'));
        }).length;
        expect(count).to.equal(1);
    });

    it('empty zoo should return an empty object', () => {
        const zoo: Zoo = new Zoo();
        expect(serialize(zoo)).to.deep.equal({});
    });

    it('{} should return an empty object', () => {
        expect(serialize({})).to.deep.equal({});
    });

    const zooWithUndefinedValue: Zoo = new Zoo();
    zooWithUndefinedValue.id = 4;
    zooWithUndefinedValue.name = undefined;

    it('zooWithUndefinedValue should return an object with undefined value', () => {
        expect(serialize(zooWithUndefinedValue, false)).to.deep.equal({ id: 4, name: undefined });
    });

    it('zooWithUndefinedValue should return an object without undefined value', () => {
        expect(serialize(zooWithUndefinedValue)).to.deep.equal({ id: 4 });
    });
});

describe('deserialize', () => {
    it('should return true', () => {
        expect(deserialize(data, Zoo)).to.deep.equal(deserializedData);
    });

    it('should return true even if there are fake data included', () => {
        const alteredData: any = { ...data };
        alteredData['fake'] = 'fake';
        alteredData['Animals'][0]['fake'] = 'fake';
        expect(deserialize(alteredData, Zoo)).to.deep.equal(deserializedData);
    });

    it('should return an empty zoo (except for the isOpen property)', () => {
        const badData: any = {
            fake: 'fake'
        };
        expect(deserialize(badData, Zoo)).to.deep.equal({ isOpen: true });
    });
});

describe('castSimpleData', () => {
    const castSimpleData: Function = tjs.__get__('castSimpleData');
    it('should return hello', () => {
        expect(castSimpleData('string', 'hello')).to.equal('hello');
    });

    it('should return 4', () => {
        expect(castSimpleData('number', 4)).to.equal(4);
    });

    it('should return false', () => {
        expect(castSimpleData('boolean', false)).to.equal(false);
    });

    it('should return 4 as string', () => {
        expect(castSimpleData('string', 4)).to.equal('4');
    });

    it('should return true as string', () => {
        expect(castSimpleData('string', true)).to.equal('true');
    });

    it('should return 4', () => {
        expect(castSimpleData('number', '4')).to.equal(4);
    });

    it('should return undefined', () => {
        expect(castSimpleData('number', 'hello')).to.equal(undefined);
    });

    it('should return undefined', () => {
        expect(castSimpleData('boolean', 'hello')).to.equal(undefined);
    });

    it('should return undefined', () => {
        expect(castSimpleData('boolean', 4)).to.equal(undefined);
    });

    it('should return undefined', () => {
        expect(castSimpleData('date', 'hello')).to.equal(undefined);
    });

    it('should return undefined', () => {
        expect(castSimpleData('date', true)).to.equal(undefined);
    });

    it('should return a date', () => {
        expect(castSimpleData('date', 4)).to.deep.equal(new Date(4));
    });

    it('should return 2018-05-01T12:50:59.534Z', () => {
        expect(castSimpleData('date', '2018-05-01T12:50:59.534Z')).to.deep.equal(new Date('2018-05-01T12:50:59.534Z'));
    });

});

describe('isSerializable', () => {
    const isSerializable: Function = tjs.__get__('isSerializable');
    it('should return true', () => {
        expect(isSerializable(Zoo)).to.equal(true);
    });

    it('should return false', () => {
        expect(isSerializable(Dummy)).to.equal(false);
    });
});

describe('getJsonPropertyValue', () => {
    const getJsonPropertyValue: Function = tjs.__get__('getJsonPropertyValue');
    it('should return name equals to key and type equals undefined', () => {
        expect(getJsonPropertyValue('hello', undefined)).to.deep.equal({ name: 'hello', type: undefined });
    });

    it('should return name equals to args and type equals undefined', () => {
        expect(getJsonPropertyValue('hello', 'Hello')).to.deep.equal({ name: 'Hello', type: undefined });
    });

    it('should return name equals to key and type equals args["type"]', () => {
        expect(getJsonPropertyValue('zoo', { type: Zoo })).to.deep.equal({ name: 'zoo', type: Zoo });
    });

    it('should return name equals to args["name"] and type equals args["type"]', () => {
        expect(getJsonPropertyValue('zoo', { name: 'myZoo', type: Zoo })).to.deep.equal({ name: 'myZoo', type: Zoo });
    });
});
