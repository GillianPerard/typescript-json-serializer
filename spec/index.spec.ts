import { expect } from 'chai';

import { JsonProperty, Serializable, serialize, deserialize } from '../src/index';

import { Snake } from '../examples/models/snake';
import { Zoo } from '../examples/models/zoo';
import { Panther } from '../examples/models/panther';
import { data, deserializedData } from '../examples/json/data';

import 'reflect-metadata';
import * as _ from 'lodash';

describe('Serializable', () => {

    const zoo: Zoo = new Zoo();
    const panther: Panther = new Panther();
    const snake: Snake = new Snake();

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
        const result: any = serialize(deserializedData);
        const isEqual: boolean = _.isEqual(result, data);
        expect(isEqual).to.equal(true);
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
        const result: Zoo = deserialize(data, Zoo);
        const isEqual: boolean = _.isEqual(result, deserializedData);
        expect(isEqual).to.equal(true);
    });
});

