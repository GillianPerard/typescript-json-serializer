"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
require("reflect-metadata");
/**
 * Decorator JsonProperty
 */
function JsonProperty(args) {
    return function (target, key) {
        var map = {};
        var targetName = target.constructor.name;
        if (Reflect.hasMetadata('api:map:' + targetName, target)) {
            map = Reflect.getMetadata('api:map:' + targetName, target);
        }
        map[key] = getJsonPropertyValue(key, args);
        Reflect.defineMetadata('api:map:' + targetName, map, target);
    };
}
exports.JsonProperty = JsonProperty;
/**
 * Decorator Serializable
 */
function Serializable(parentType) {
    return function (target) {
        Reflect.defineMetadata('api:map:serializable', parentType, target);
    };
}
exports.Serializable = Serializable;
/**
 * Function to deserialize json into a class
 */
function deserialize(json, type) {
    var instance = new type();
    var instanceName = instance.constructor.name;
    var parentTypeName = Reflect.getMetadata('api:map:serializable', type);
    var instanceMap = {};
    if (Reflect.hasMetadata('api:map:' + instanceName, instance)) {
        instanceMap = Reflect.getMetadata('api:map:' + instanceName, instance);
        if (parentTypeName) {
            var parentTypeMap = Reflect.getMetadata('api:map:' + parentTypeName, instance);
            instanceMap = _.merge(instanceMap, parentTypeMap);
        }
        var keys = _.keys(instanceMap);
        _.forEach(keys, function (key) {
            if (json[instanceMap[key].name] !== undefined) {
                instance[key] = convertDataToProperty(instance, key, instanceMap[key], json[instanceMap[key].name]);
            }
        });
    }
    return instance;
}
exports.deserialize = deserialize;
/**
 * Function to serialize a class into json
 */
function serialize(instance, removeUndefined) {
    if (removeUndefined === void 0) { removeUndefined = true; }
    var json = {};
    var instanceName = instance.constructor.name;
    var parentTypeName = Reflect.getMetadata('api:map:serializable', instance.constructor);
    var instanceMap = {};
    if (Reflect.hasMetadata('api:map:' + instanceName, instance)) {
        instanceMap = Reflect.getMetadata('api:map:' + instanceName, instance);
        if (parentTypeName !== undefined) {
            var parentTypeMap = Reflect.getMetadata('api:map:' + parentTypeName, instance);
            instanceMap = _.merge(instanceMap, parentTypeMap);
        }
        Object.keys(instanceMap).forEach(function (key) {
            var data = convertPropertyToData(instance, key, instanceMap[key], removeUndefined);
            if (!removeUndefined || removeUndefined && data !== undefined) {
                json[instanceMap[key].name] = data;
            }
        });
    }
    return json;
}
exports.serialize = serialize;
/**
 * Function to convert json data to the class property
 */
function convertPropertyToData(instance, key, value, removeUndefined) {
    var property = instance[key];
    var isArray = Reflect.getMetadata('design:type', instance, key).name === 'Array';
    var propertyType = value.type || Reflect.getMetadata('design:type', instance, key);
    var isSerializableProperty = isSerializable(propertyType);
    if (isSerializableProperty) {
        if (isArray) {
            var array_1 = [];
            property.forEach(function (d) {
                array_1.push(serialize(d, removeUndefined));
            });
            return array_1;
        }
        return serialize(property, removeUndefined);
    }
    else {
        if (propertyType.name === 'Date') {
            return property.toISOString();
        }
        return property;
    }
}
/**
 * Function to convert json data to the class property
 */
function convertDataToProperty(instance, key, value, data) {
    var isArray = Reflect.getMetadata('design:type', instance, key).name === 'Array';
    var propertyType = value.type || Reflect.getMetadata('design:type', instance, key);
    var isSerializableProperty = isSerializable(propertyType);
    if (isSerializableProperty) {
        if (isArray) {
            var array_2 = [];
            data.forEach(function (d) {
                array_2.push(deserialize(d, propertyType));
            });
            return array_2;
        }
        else {
            return deserialize(data, propertyType);
        }
    }
    else {
        return castSimpleData(propertyType.name, data);
    }
}
/**
 * Function to test if a class has the serializable decorator (metadata)
 */
function isSerializable(type) {
    return Reflect.hasMetadata('api:map:serializable', type);
}
/**
 * Function to transform the JsonProperty value into an object like {name: string, type: Function}
 */
function getJsonPropertyValue(key, args) {
    if (args) {
        return {
            name: typeof args === 'string' ? args : args['name'] ? args['name'] : key.toString(),
            type: args['type']
        };
    }
    else {
        return {
            name: key.toString(),
            type: undefined
        };
    }
}
/**
 * Function to cast simple type data into the real class property type
 */
function castSimpleData(type, data) {
    type = type.toLowerCase();
    if ((typeof data).toLowerCase() === type.toLowerCase()) {
        return data;
    }
    else {
        if (type === 'string') {
            return data.toString();
        }
        else if (type === 'number') {
            var n = +data;
            if (isNaN(n)) {
                throw new Error(data + ": Type " + typeof data + " is not assignable to type " + type + ".");
            }
            else {
                return n;
            }
        }
        else if (type === 'boolean') {
            throw new Error(data + ": Type " + typeof data + " is not assignable to type " + type + ".");
        }
        else if (type === 'date') {
            var n = Date.parse(data);
            if (isNaN(n)) {
                throw new Error(data + ": Type " + typeof data + " is not assignable to type " + type + ".");
            }
            else {
                return new Date(data);
            }
        }
        return data;
    }
}
