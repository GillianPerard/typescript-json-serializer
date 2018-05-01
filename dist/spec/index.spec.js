"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var index_1 = require("../src/index");
var panther_1 = require("../examples/models/panther");
var snake_1 = require("../examples/models/snake");
var zoo_1 = require("../examples/models/zoo");
var data_1 = require("../examples/json/data");
require("reflect-metadata");
var _ = require("lodash");
var rewire = require('rewire');
var tjs = rewire('../src/index');
describe('Serializable', function () {
    it('should return false', function () {
        var hasMetadata = Reflect.hasOwnMetadata('api:map:serializable', snake_1.Snake);
        chai_1.expect(hasMetadata).to.equal(false);
    });
    it('should return true without value', function () {
        var hasMetadata = Reflect.hasOwnMetadata('api:map:serializable', zoo_1.Zoo);
        var metadata = Reflect.getOwnMetadata('api:map:serializable', zoo_1.Zoo);
        chai_1.expect(hasMetadata).to.equal(true);
        chai_1.expect(metadata).to.equal(undefined);
    });
    it('should return true with value', function () {
        var hasMetadata = Reflect.hasOwnMetadata('api:map:serializable', panther_1.Panther);
        var metadata = Reflect.getOwnMetadata('api:map:serializable', panther_1.Panther);
        chai_1.expect(hasMetadata).to.equal(true);
        chai_1.expect(metadata).to.equal('Animal');
    });
});
describe('serialize', function () {
    it('should return true', function () {
        chai_1.expect(index_1.serialize(data_1.deserializedData)).to.deep.equal(data_1.data);
    });
    it('should return 3', function () {
        var result = index_1.serialize(data_1.deserializedData, false);
        var count = 0;
        _.forEach(result.Panthers, function (panther) {
            if (panther.hasOwnProperty('childrenIdentifiers')) {
                count++;
            }
        });
        chai_1.expect(count).to.equal(3);
    });
});
describe('deserialize', function () {
    it('should return true', function () {
        chai_1.expect(index_1.deserialize(data_1.data, zoo_1.Zoo)).to.deep.equal(data_1.deserializedData);
    });
});
describe('castSimpleData', function () {
    var castSimpleData = tjs.__get__('castSimpleData');
    it('should return hello', function () {
        chai_1.expect(castSimpleData('string', 'hello')).to.equal('hello');
    });
    it('should return 4', function () {
        chai_1.expect(castSimpleData('number', 4)).to.equal(4);
    });
    it('should return false', function () {
        chai_1.expect(castSimpleData('boolean', false)).to.equal(false);
    });
    it('should return 4 as string', function () {
        chai_1.expect(castSimpleData('string', 4)).to.equal('4');
    });
    it('should return true as string', function () {
        chai_1.expect(castSimpleData('string', true)).to.equal('true');
    });
    it('should return 4', function () {
        chai_1.expect(castSimpleData('number', '4')).to.equal(4);
    });
    it('should return undefined', function () {
        chai_1.expect(castSimpleData('number', 'hello')).to.equal(undefined);
    });
    it('should return undefined', function () {
        chai_1.expect(castSimpleData('boolean', 'hello')).to.equal(undefined);
    });
    it('should return undefined', function () {
        chai_1.expect(castSimpleData('boolean', 4)).to.equal(undefined);
    });
    it('should return undefined', function () {
        chai_1.expect(castSimpleData('date', 'hello')).to.equal(undefined);
    });
    it('should return undefined', function () {
        chai_1.expect(castSimpleData('date', true)).to.equal(undefined);
    });
    it('should return a date', function () {
        chai_1.expect(castSimpleData('date', 4)).to.deep.equal(new Date(4));
    });
    it('should return 2018-05-01T12:50:59.534Z', function () {
        chai_1.expect(castSimpleData('date', '2018-05-01T12:50:59.534Z')).to.deep.equal(new Date('2018-05-01T12:50:59.534Z'));
    });
});
describe('isSerializable', function () {
    var isSerializable = tjs.__get__('isSerializable');
    it('should return true', function () {
        chai_1.expect(isSerializable(zoo_1.Zoo)).to.equal(true);
    });
    it('should return false', function () {
        chai_1.expect(isSerializable(snake_1.Snake)).to.equal(false);
    });
});
describe('getJsonPropertyValue', function () {
    var getJsonPropertyValue = tjs.__get__('getJsonPropertyValue');
    it('should return name equals to key and type equals undefined', function () {
        chai_1.expect(getJsonPropertyValue('hello', undefined)).to.deep.equal({ name: 'hello', type: undefined });
    });
    it('should return name equals to args and type equals undefined', function () {
        chai_1.expect(getJsonPropertyValue('hello', 'Hello')).to.deep.equal({ name: 'Hello', type: undefined });
    });
    it('should return name equals to key and type equals args["type"]', function () {
        chai_1.expect(getJsonPropertyValue('zoo', { type: zoo_1.Zoo })).to.deep.equal({ name: 'zoo', type: zoo_1.Zoo });
    });
    it('should return name equals to args["name"] and type equals args["type"]', function () {
        chai_1.expect(getJsonPropertyValue('zoo', { name: 'myZoo', type: zoo_1.Zoo })).to.deep.equal({ name: 'myZoo', type: zoo_1.Zoo });
    });
});
