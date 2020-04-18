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
    | { name?: string; type?: Function; onSerialize?: Function; onDeserialize?: Function }
    | { name?: string; predicate?: Function; onSerialize?: Function; onDeserialize?: Function };

type Metadata =
    | { name: string; type: Function; onSerialize: Function; onDeserialize: Function }
    | { name: string; predicate: Function; onSerialize: Function; onDeserialize: Function };

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
function getBaseClassMaps(baseClassNames: Array<string>, instance: any): { [id: string]: Metadata } {
    let baseClassMaps: { [id: string]: Metadata } = {};

    baseClassNames.forEach(baseClassName => {
        baseClassMaps = { ...baseClassMaps, ...Reflect.getMetadata(`${apiMap}${baseClassName}`, instance) };
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

    const keys: Array<string> = Object.keys(instanceMap);
    keys.forEach(key => {
        if (json[instanceMap[key].name] !== undefined) {
            instance[key] = convertDataToProperty(instance, key, instanceMap[key], json[instanceMap[key].name]);
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
    const json: any = {};
    const instanceName = instance.constructor.name;
    const baseClassNames: Array<string> = Reflect.getMetadata(apiMapSerializable, instance.constructor);
    const apiMapInstanceName = `${apiMap}${instanceName}`;
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
        if (instanceKeys.includes(key)) {
            const data = convertPropertyToData(instance, key, instanceMap[key], removeUndefined);

            if (!removeUndefined || (removeUndefined && data !== undefined)) {
                json[instanceMap[key].name] = data;
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
 * @param {Metadata} value The metadata of the property to convert
 * @param {boolean} removeUndefined Indicates if you want to keep or remove undefined value
 * @returns {any} The converted property
 */
function convertPropertyToData(instance: Function, key: string, value: Metadata, removeUndefined: boolean): any {
    let property: any = instance[key];
    const type: any = Reflect.getMetadata(designType, instance, key);
    const isArray = type.name.toLocaleLowerCase() === Type.Array;
    const predicate: Function = value['predicate'];
    const onSerialize: Function = value['onSerialize'];
    const propertyType: any = value['type'] || type;
    const isSerializableProperty = isSerializable(propertyType);

    if (onSerialize) {
        property = onSerialize(property);
    }

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
 * @param {Metadata} value The metadata of the property to convert
 * @param {any} data Data containing the values
 */
function convertDataToProperty(instance: Function, key: string, value: Metadata, data: any) {
    const type: any = Reflect.getMetadata(designType, instance, key);
    const isArray = type.name.toLowerCase() === Type.Array;
    const predicate: Function = value['predicate'];
    const onDeserialize: Function = value['onDeserialize'];
    let propertyType: any = value['type'] || type;
    const isSerializableProperty = isSerializable(propertyType);

    if (onDeserialize) {
        data = onDeserialize(data);
    }

    if (!isSerializableProperty && !predicate) {
        return castSimpleData(propertyType.name, data);
    }

    if (isArray) {
        const array = [];
        data.forEach((d: any) => {
            if (predicate) {
                propertyType = predicate(d);
            }
            array.push(deserialize(d, propertyType));
        });

        return array;
    }

    propertyType = predicate ? predicate(data) : propertyType;
    return deserialize(data, propertyType);
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
            onSerialize: undefined
        };
    }
    const name: string = typeof args === Type.String ? args : args['name'] ? args['name'] : key.toString();
    return args['predicate']
        ? { name, predicate: args['predicate'], onDeserialize: args['onDeserialize'], onSerialize: args['onSerialize'] }
        : { name, type: args['type'], onDeserialize: args['onDeserialize'], onSerialize: args['onSerialize'] };
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
            return data.toString();
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
