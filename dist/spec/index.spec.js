"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var index_1 = require("../src/index");
var snake_1 = require("../examples/models/snake");
var zoo_1 = require("../examples/models/zoo");
var panther_1 = require("../examples/models/panther");
var data_1 = require("../examples/json/data");
require("reflect-metadata");
var _ = require("lodash");
describe('Serializable', function () {
    var zoo = new zoo_1.Zoo();
    var panther = new panther_1.Panther();
    var snake = new snake_1.Snake();
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
        var result = index_1.serialize(data_1.deserializedData);
        var isEqual = _.isEqual(result, data_1.data);
        chai_1.expect(isEqual).to.equal(true);
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
        var result = index_1.deserialize(data_1.data, zoo_1.Zoo);
        var isEqual = _.isEqual(result, data_1.deserializedData);
        chai_1.expect(isEqual).to.equal(true);
    });
});
