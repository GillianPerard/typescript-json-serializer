import { expect } from 'chai';

import { serialize, deserialize } from '../src/index';

import { Panther } from '../examples/models/panther';
import { Snake } from '../examples/models/snake';
import { Zoo } from '../examples/models/zoo';

import { data, deserializedData } from '../examples/json/data';

import 'reflect-metadata';
import * as _ from 'lodash';
const rewire: any = require('rewire');
const tjs: any = rewire('../src/index');

describe('Serializable', () => {

    it('should return false', () => {
        const hasMetadata: boolean = Reflect.hasOwnMetadata('api:map:serializable', Snake);
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

    it('should return 3', () => {
        const result: any = serialize(deserializedData, false);
        let count: number = 0;
        _.forEach(result.Panthers, (panther: any) => {
            if (panther.hasOwnProperty('childrenIdentifiers')) {
                count++;
            }
        });
        expect(count).to.equal(3);
    });
});

describe('deserialize', () => {
    it('should return true', () => {
        expect(deserialize(data, Zoo)).to.deep.equal(deserializedData);
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
        expect(isSerializable(Snake)).to.equal(false);
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
