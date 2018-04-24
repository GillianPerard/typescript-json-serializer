import * as _ from 'lodash';
import 'reflect-metadata';

/**
 * Decorator JsonProperty
 */
export function JsonProperty(args?: string | { name?: string, type: Function }): Function {
    return (target: Object, key: string): void => {

        let map: { [id: string]: { name: string, type: Function }; } = {};
        const targetName: string = target.constructor.name;

        if (Reflect.hasMetadata('api:map:' + targetName, target)) {
            map = Reflect.getMetadata('api:map:' + targetName, target);
        }

        map[key] = getJsonPropertyValue(key, args);
        Reflect.defineMetadata('api:map:' + targetName, map, target);
    };
}

/**
 * Decorator Serializable
 */
export function Serializable(parentType?: string): Function {
    return (target: Object): void => {
        Reflect.defineMetadata('api:map:serializable', parentType, target);
    };
}

/**
 * Function to deserialize json into a class
 */
export function deserialize(json: any, type: any): any {

    const instance: any = new type();
    const instanceName: string = instance.constructor.name;
    const parentTypeName: string = Reflect.getMetadata('api:map:serializable', type);
    let instanceMap: { [id: string]: { name: string, type: Function }; } = {};

    if (Reflect.hasMetadata('api:map:' + instanceName, instance)) {
        instanceMap = Reflect.getMetadata('api:map:' + instanceName, instance);

        if (parentTypeName) {
            const parentTypeMap: { [id: string]: any; } = Reflect.getMetadata('api:map:' + parentTypeName, instance);
            instanceMap = _.merge(instanceMap, parentTypeMap);
        }

        const keys: Array<string> = _.keys(instanceMap);
        _.forEach(keys, (key: string) => {
            if (json[instanceMap[key].name] !== undefined) {
                instance[key] = convertDataToProperty(instance, key, instanceMap[key], json[instanceMap[key].name]);
            }
        });
    }

    return instance;
}

/**
 * Function to serialize a class into json
 */
export function serialize(instance: any, removeUndefined: boolean = true): any {

    const json: any = {};
    const instanceName: string = instance.constructor.name;
    const parentTypeName: string = Reflect.getMetadata('api:map:serializable', instance.constructor);
    let instanceMap: { [id: string]: { name: string, type: Function }; } = {};

    if (Reflect.hasMetadata('api:map:' + instanceName, instance)) {
        instanceMap = Reflect.getMetadata('api:map:' + instanceName, instance);

        if (parentTypeName !== undefined) {
            const parentTypeMap: { [id: string]: any; } = Reflect.getMetadata('api:map:' + parentTypeName, instance);
            instanceMap = _.merge(instanceMap, parentTypeMap);
        }

        Object.keys(instanceMap).forEach((key: string) => {
            const data: any = convertPropertyToData(instance, key, instanceMap[key], removeUndefined);

            if (!removeUndefined || removeUndefined && data !== undefined) {
                json[instanceMap[key].name] = data;
            }
        });
    }

    return json;
}

/**
 * Function to convert json data to the class property
 */
function convertPropertyToData(instance: Function, key: string, value: { name: string, type: Function }, removeUndefined: boolean): any {

    const property: any = instance[key];
    const isArray: boolean = Reflect.getMetadata('design:type', instance, key).name === 'Array';
    const propertyType: any = value.type || Reflect.getMetadata('design:type', instance, key);
    const isSerializableProperty: boolean = isSerializable(propertyType);

    if (isSerializableProperty) {
        if (isArray) {
            const array: Array<any> = [];
            property.forEach((d: any) => {
                array.push(serialize(d, removeUndefined));
            });

            return array;
        }

        return serialize(property, removeUndefined);
    } else {
        if (propertyType.name === 'Date') {
            return property.toISOString();
        }

        return property;
    }
}

/**
 * Function to convert json data to the class property
 */
function convertDataToProperty(instance: Function, key: string, value: { name: string, type: Function }, data: any): any {

    const isArray: boolean = Reflect.getMetadata('design:type', instance, key).name === 'Array';
    const propertyType: any = value.type || Reflect.getMetadata('design:type', instance, key);
    const isSerializableProperty: boolean = isSerializable(propertyType);

    if (isSerializableProperty) {
        if (isArray) {
            const array: Array<any> = [];
            data.forEach((d: any) => {
                array.push(deserialize(d, propertyType));
            });

            return array;
        } else {
            return deserialize(data, propertyType);
        }
    } else {
        return castSimpleData(propertyType.name, data);
    }
}

/**
 * Function to test if a class has the serializable decorator (metadata)
 */
function isSerializable(type: any): boolean {
    return Reflect.hasMetadata('api:map:serializable', type);
}

/**
 * Function to transform the JsonProperty value into an object like {name: string, type: Function}
 */
function getJsonPropertyValue(key: string, args: string | { name?: string, type: Function }): { name: string, type: Function } {
    if (args) {
        return {
            name: typeof args === 'string' ? args : args['name'] ? args['name'] : key.toString(),
            type: args['type']
        };
    } else {
        return {
            name: key.toString(),
            type: undefined
        };
    }
}

/**
 * Function to cast simple type data into the real class property type
 */
function castSimpleData(type: string, data: any): any {
    type = type.toLowerCase();

    if ((typeof data).toLowerCase() === type.toLowerCase()) {
        return data;
    } else {
        if (type === 'string') {
            return data.toString();
        } else if (type === 'number') {
            const n: number = +data;

            if (isNaN(n)) {
                throw new Error(`${data}: Type ${typeof data} is not assignable to type ${type}.`);
            } else {
                return n;
            }
        } else if (type === 'boolean') {
            throw new Error(`${data}: Type ${typeof data} is not assignable to type ${type}.`);
        } else if (type === 'date') {
            const n: number = Date.parse(data);

            if (isNaN(n)) {
                throw new Error(`${data}: Type ${typeof data} is not assignable to type ${type}.`);
            } else {
                return new Date(data);
            }
        }

        return data;
    }
}

