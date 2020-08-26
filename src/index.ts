import 'reflect-metadata';

const apiMap = 'api:map:';
const apiMapSerializable = `${apiMap}serializable`;
const designType = 'design:type';
const designParamTypes = 'design:paramtypes';

// Enums
enum Type {
    Array = 'array',
    Boolean = 'boolean',
    Date = 'date',
    Number = 'number',
    String = 'string'
}

// Types
type Args =
    | string
    | {
          name?: string;
          type?: Function;
          onSerialize?: Function;
          onDeserialize?: Function;
          postDeserialize?: Function;
      }
    | {
          name?: string;
          predicate?: Function;
          onSerialize?: Function;
          onDeserialize?: Function;
          postDeserialize?: Function;
      }
    | {
          names: Array<string>;
          type?: Function;
          onSerialize?: Function;
          onDeserialize?: Function;
          postDeserialize?: Function;
      }
    | {
          names: Array<string>;
          predicate?: Function;
          onSerialize?: Function;
          onDeserialize?: Function;
          postDeserialize?: Function;
      };

type Metadata =
    | {
          name: string;
          type: Function;
          onSerialize: Function;
          onDeserialize: Function;
          postDeserialize: Function;
      }
    | {
          name: string;
          predicate: Function;
          onSerialize: Function;
          onDeserialize: Function;
          postDeserialize: Function;
      }
    | {
          names: Array<string>;
          type: Function;
          onSerialize: Function;
          onDeserialize: Function;
          postDeserialize: Function;
      }
    | {
          names: Array<string>;
          predicate: Function;
          onSerialize: Function;
          onDeserialize: Function;
          postDeserialize: Function;
      };

/**
 * Function to get all base class names recursively
 *
 * @param {Object} target The target class from which the parent classes are extracted
 * @returns {Array<string>} All the base class names
 */
function getBaseClassNames(target: Object): Array<string> {
    const names: Array<string> = [];
    const baseClass = Reflect.getPrototypeOf(target);

    if (!baseClass || !baseClass['name']) {
        return names;
    }

    names.push(baseClass['name']);
    return [...names, ...getBaseClassNames(baseClass)];
}

/**
 * Function to find the name of function properties
 *
 * @param {object} ctor The constructor from which the properties are extracted
 * @returns {Array<string>} All the property names
 */
function getPropertyNames(ctor: object): Map<number, string> {
    // Remove all kind of comments
    const ctorWithoutComments = ctor.toString().replace(/(\/\*[\s\S]*?\*\/|\/\/.*$)/gm, '');
    const ctorOnSingleLine = ctorWithoutComments.replace(/[\r\t\n\v\f]/g, '');
    const ctorWithoutSuccessiveWhiteSpaces = ctorOnSingleLine.replace(/( +)/g, ' ');

    // Parse function body
    const constructorParamPattern = /(?:.*(?:constructor|function).*?(?=\())(?:\()(.+?(?=\)))/m;
    const propertyPattern = /(?:this\.)([^\n\r\t\f\v;]+)([\s;])/gm;
    const propertyNames = new Map<number, string>();
    const paramsExecArray = constructorParamPattern.exec(ctorWithoutSuccessiveWhiteSpaces);

    if (!paramsExecArray || !paramsExecArray.length) {
        return propertyNames;
    }

    const params = paramsExecArray[1].replace(/ /g, '').split(',');
    let match: RegExpExecArray;

    // Get params
    while ((match = propertyPattern.exec(ctorWithoutSuccessiveWhiteSpaces))) {
        const matchResult = match[1].replace(/ /g, '').split('=');
        const index = params.findIndex(param => param === matchResult[1]);

        if (index > -1) {
            propertyNames.set(index, matchResult[0]);
        }
    }

    return propertyNames;
}

/**
 * Decorator to take the property in account during the serialize and deserialize function
 * @param {Args} args Arguments to describe the property
 */

export function JsonProperty(args?: Args): Function {
    return (target: Object | Function, key: string, index: number): void => {
        if (key === undefined && target['prototype']) {
            const type: Function = Reflect.getMetadata(designParamTypes, target)[index];
            const keys = getPropertyNames(target['prototype'].constructor);
            key = keys.get(index);
            target = target['prototype'];
            Reflect.defineMetadata(designType, type, target, key);
        }

        let map: { [id: string]: Metadata } = {};
        const targetName = target.constructor.name;
        const apiMapTargetName = `${apiMap}${targetName}`;

        if (Reflect.hasMetadata(apiMapTargetName, target)) {
            map = Reflect.getMetadata(apiMapTargetName, target);
        }

        map[key] = getJsonPropertyValue(key, args);
        Reflect.defineMetadata(apiMapTargetName, map, target);
    };
}

/**
 * Decorator to make a class Serializable
 *
 * BREAKING CHANGE: Since version 2.0.0 the parameter `baseClassName` is not needed anymore
 */
export function Serializable(): Function {
    return (target: Object) => {
        const baseClassNames = getBaseClassNames(target);
        Reflect.defineMetadata(apiMapSerializable, baseClassNames, target);
    };
}

/**
 * Function to retrieve and merge all base class properties
 *
 * @param baseClassNames The base classe names of the instance provided
 * @param {any} instance The instance target from which the parents metadata are extracted
 * @returns {{ [id: string]: Metadata }} All base class metadata properties
 */
function getBaseClassMaps(
    baseClassNames: Array<string>,
    instance: any
): { [id: string]: Metadata } {
    let baseClassMaps: { [id: string]: Metadata } = {};

    baseClassNames.forEach(baseClassName => {
        baseClassMaps = {
            ...baseClassMaps,
            ...Reflect.getMetadata(`${apiMap}${baseClassName}`, instance)
        };
    });

    return baseClassMaps;
}

/**
 * Function to deserialize json into a class
 *
 * @param {object} json The json to deserialize
 * @param {new (...params: Array<any>) => T} type The class in which we want to deserialize
 * @returns {T} The instance of the specified type containing all deserialized properties
 */
export function deserialize<T>(json: object, type: new (...params: Array<any>) => T): T {
    if ([null, undefined].includes(json)) {
        return json as never;
    }

    if (type === undefined) {
        return castSimpleData(typeof json, json);
    }

    const instance: any = new type();
    const instanceName = instance.constructor.name;
    const baseClassNames: Array<string> = Reflect.getMetadata(apiMapSerializable, type);
    const apiMapInstanceName = `${apiMap}${instanceName}`;
    const hasMap = Reflect.hasMetadata(apiMapInstanceName, instance);
    let instanceMap: { [id: string]: Metadata } = {};

    if (!hasMap && (!baseClassNames || !baseClassNames.length)) {
        return instance;
    }

    instanceMap = Reflect.getMetadata(apiMapInstanceName, instance);

    if (baseClassNames && baseClassNames.length) {
        instanceMap = { ...instanceMap, ...getBaseClassMaps(baseClassNames, instance) };
    }

    Object.keys(instanceMap).forEach(key => {
        const property = convertDataToProperty(instance, key, instanceMap[key], json);

        if (property !== undefined) {
            instance[key] = property;
        }
    });

    return instance;
}

/**
 * Function to serialize a class into json
 *
 * @param {any} instance Instance of the object to deserialize
 * @param {boolean} removeUndefined Indicates if you want to keep or remove undefined values
 * @returns {any} The json object
 */
export function serialize(instance: any, removeUndefined: boolean = true): any {
    if ([undefined, null].includes(instance)) {
        return instance;
    }

    const json: any = {};
    const instanceName = instance.constructor.name;
    const baseClassNames: Array<string> = Reflect.getMetadata(
        apiMapSerializable,
        instance.constructor
    );

    const apiMapInstanceName = `${apiMap}${instanceName}`;

    if (typeof instance !== 'object') {
        return instance;
    }

    const hasMap = Reflect.hasMetadata(apiMapInstanceName, instance);
    let instanceMap: { [id: string]: Metadata } = {};

    if (!hasMap && (!baseClassNames || !baseClassNames.length)) {
        return json;
    }

    instanceMap = Reflect.getMetadata(apiMapInstanceName, instance);

    if (baseClassNames && baseClassNames.length) {
        instanceMap = { ...instanceMap, ...getBaseClassMaps(baseClassNames, instance) };
    }

    const instanceKeys = Object.keys(instance);
    Object.keys(instanceMap).forEach(key => {
        const onSerialize: Function = instanceMap[key]['onSerialize'];

        if (instanceKeys.includes(key)) {
            let data = convertPropertyToData(instance, key, instanceMap[key], removeUndefined);

            if (onSerialize) {
                data = onSerialize(data, instance);
            }

            if (instanceMap[key]['names']) {
                instanceMap[key]['names'].forEach((name: string) => {
                    if (!removeUndefined || (removeUndefined && data[name] !== undefined)) {
                        json[name] = data[name];
                    }
                });
            } else {
                if (!removeUndefined || (removeUndefined && data !== undefined)) {
                    json[instanceMap[key]['name']] = data;
                }
            }
        }
    });

    return json;
}

/**
 * Function to convert class property to json data
 *
 * @param {Function} instance The instance containing the property to convert
 * @param {string} key The name of the property to convert
 * @param {Metadata} metadata The metadata of the property to convert
 * @param {boolean} removeUndefined Indicates if you want to keep or remove undefined value
 * @returns {any} The converted property
 */
function convertPropertyToData(
    instance: Function,
    key: string,
    metadata: Metadata,
    removeUndefined: boolean
): any {
    const property: any = instance[key];
    const type: any = Reflect.getMetadata(designType, instance, key);
    const isArray = type.name.toLocaleLowerCase() === Type.Array;
    const predicate: Function = metadata['predicate'];
    const propertyType: any = metadata['type'] || type;
    const isSerializableProperty = isSerializable(propertyType);

    if (property && (isSerializableProperty || predicate)) {
        if (isArray) {
            const array = [];
            property.forEach((d: any) => {
                array.push(serialize(d, removeUndefined));
            });

            return array;
        }

        return serialize(property, removeUndefined);
    }

    if (propertyType.name.toLocaleLowerCase() === Type.Date) {
        return property ? property.toISOString() : property;
    }

    return property;
}

/**
 * Function to convert json data to the class property
 * @param {Function} instance The instance containing the property to convert
 * @param {string} key The name of the property to convert
 * @param {Metadata} metadata The metadata of the property to convert
 * @param {any} json Json containing the values
 */
function convertDataToProperty(instance: Function, key: string, metadata: Metadata, json: any) {
    let data: any;

    if ([null, undefined].includes(json)) {
        return json;
    }

    if (metadata['names']) {
        const object = {};
        metadata['names'].forEach((name: string) => (object[name] = json[name]));
        data = object;
    } else {
        data = json[metadata['name']];
    }

    if ([null, undefined].includes(data)) {
        return data;
    }

    const type: any = Reflect.getMetadata(designType, instance, key);
    const isArray = type.name.toLowerCase() === Type.Array;
    const predicate: Function = metadata['predicate'];
    const onDeserialize: Function = metadata['onDeserialize'];
    const postDeserialize: Function = metadata['postDeserialize'];
    let propertyType: any = metadata['type'] || type;
    const isSerializableProperty = isSerializable(propertyType);
    let result: any;

    if (onDeserialize) {
        data = onDeserialize(data, instance);
    }

    if (!isSerializableProperty && !predicate) {
        result = castSimpleData(propertyType.name, data);
    } else if (isArray) {
        const array = [];

        if (!Array.isArray(data)) {
            console.error(`${data} is not and array.`);
            result = undefined;
        } else {
            data.forEach((d: any) => {
                if (predicate) {
                    propertyType = predicate(d);
                }
                array.push(deserialize(d, propertyType));
            });
            result = array;
        }
    } else {
        propertyType = predicate ? predicate(data) : propertyType;
        result = deserialize(data, propertyType);
    }

    if (postDeserialize) {
        result = postDeserialize(result, instance);
    }

    return result;
}

/**
 * Function to test if a class is serializable
 *
 * @param {any} type The type to test
 * @returns {boolean} If the type is serializable or not
 */
function isSerializable(type: any): boolean {
    return Reflect.hasOwnMetadata(apiMapSerializable, type);
}

/**
 * Function to transform the JsonProperty value into Metadata
 *
 * @param {string} key The property name
 * @param {Args} args Arguments to describe the property
 * @returns {Metadata} The metadata object
 */
function getJsonPropertyValue(key: string, args: Args): Metadata {
    if (!args) {
        return {
            name: key.toString(),
            type: undefined,
            onDeserialize: undefined,
            onSerialize: undefined,
            postDeserialize: undefined
        };
    }

    let metadata: any;
    if (typeof args === Type.String) {
        metadata = { name: args };
    } else if (args['name']) {
        metadata = { name: args['name'] };
    } else if (args['names'] && args['names'].length) {
        metadata = { names: args['names'] };
    } else {
        metadata = { name: key.toString() };
    }

    return args['predicate']
        ? {
              ...metadata,
              predicate: args['predicate'],
              onDeserialize: args['onDeserialize'],
              onSerialize: args['onSerialize'],
              postDeserialize: args['postDeserialize']
          }
        : {
              ...metadata,
              type: args['type'],
              onDeserialize: args['onDeserialize'],
              onSerialize: args['onSerialize'],
              postDeserialize: args['postDeserialize']
          };
}

/**
 * Function to cast simple type data into the real class property type
 *
 * @param {string} type The type to cast data into
 * @param {any} data The data to cast
 * @returns {any} The casted data
 */
function castSimpleData(type: string, data: any): any {
    type = type.toLowerCase();

    if ((typeof data).toLowerCase() === type) {
        return data;
    }

    switch (type) {
        case Type.String:
            return data ? data.toString() : data;
        case Type.Number:
            const number: number = +data;
            if (isNaN(number)) {
                console.error(`${data}: Type ${typeof data} is not assignable to type ${type}.`);
                return undefined;
            }
            return number;
        case Type.Boolean:
            console.error(`${data}: Type ${typeof data} is not assignable to type ${type}.`);
            return undefined;
        case Type.Date:
            if (isNaN(Date.parse(data))) {
                console.error(`${data}: Type ${typeof data} is not assignable to type ${type}.`);
                return undefined;
            }
            return new Date(data);
        default:
            return data;
    }
}
