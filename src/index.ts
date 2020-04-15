import 'reflect-metadata';

const apiMap: string = 'api:map:';
const apiMapSerializable: string = `${apiMap}serializable`;
const designType: string = 'design:type';
const designParamTypes: string = 'design:paramtypes';

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
 * Function to find the name of function parameters
 */
function getParamNames(ctor: object): Array<string> {
    // Remove all kind of comments
    const withoutComments: string = ctor.toString().replace(/(\/\*[\s\S]*?\*\/|\/\/.*$)/gm, '');

    // Parse function body
    const parameterPattern: RegExp = /(?:this.*\.)([^\s=;]+)\s*=/gm;
    const paramNames: Array<string> = [];
    let match: RegExpExecArray;

    // Get params
    while ((match = parameterPattern.exec(withoutComments))) {
        const paramName: string = match[1];
        if (paramName) {
            paramNames.push(paramName);
        }
    }

    return paramNames;
}

/**
 * Decorator JsonProperty
 */
export function JsonProperty(args?: Args): Function {
    return (target: Object | Function, key: string, index: number): void => {
        if (key === undefined && target['prototype']) {
            const type: Function = Reflect.getMetadata(designParamTypes, target, key)[index];
            const keys: Array<string> = getParamNames(target['prototype'].constructor);
            key = keys[index];
            target = target['prototype'];
            Reflect.defineMetadata(designType, type, target, key);
        }
        let map: { [id: string]: Metadata } = {};
        const targetName: string = target.constructor.name;
        const apiMapTargetName: string = `${apiMap}${targetName}`;

        if (Reflect.hasMetadata(apiMapTargetName, target)) {
            map = Reflect.getMetadata(apiMapTargetName, target);
        }

        map[key] = getJsonPropertyValue(key, args);
        Reflect.defineMetadata(apiMapTargetName, map, target);
    };
}

/**
 * Decorator Serializable
 */
export function Serializable(baseClassName?: string): Function {
    return (target: Object): void => {
        Reflect.defineMetadata(apiMapSerializable, baseClassName, target);
    };
}

/**
 * Function to deserialize json into a class
 */
export function deserialize<T>(json: object, type: new (...params: Array<any>) => T): T {
    const instance: any = new type();
    const instanceName: string = instance.constructor.name;
    const baseClassName: string = Reflect.getMetadata(apiMapSerializable, type);
    const apiMapInstanceName: string = `${apiMap}${instanceName}`;
    const hasMap: boolean = Reflect.hasMetadata(apiMapInstanceName, instance);
    let instanceMap: { [id: string]: Metadata } = {};

    if (!hasMap && !baseClassName) {
        return instance;
    } else {
        instanceMap = Reflect.getMetadata(apiMapInstanceName, instance);
    }

    if (baseClassName) {
        const baseClassMap: { [id: string]: Metadata } = Reflect.getMetadata(`${apiMap}${baseClassName}`, instance);
        instanceMap = { ...instanceMap, ...baseClassMap };
    }

    const keys: Array<string> = Object.keys(instanceMap);
    keys.forEach((key: string): void => {
        if (json[instanceMap[key].name] !== undefined) {
            instance[key] = convertDataToProperty(instance, key, instanceMap[key], json[instanceMap[key].name]);
        }
    });

    return instance;
}

/**
 * Function to serialize a class into json
 */
export function serialize(instance: any, removeUndefined: boolean = true): any {
    const json: any = {};
    const instanceName: string = instance.constructor.name;
    const baseClassName: string = Reflect.getMetadata(apiMapSerializable, instance.constructor);
    const apiMapInstanceName: string = `${apiMap}${instanceName}`;
    const hasMap: boolean = Reflect.hasMetadata(apiMapInstanceName, instance);
    let instanceMap: { [id: string]: Metadata } = {};

    if (!hasMap && !baseClassName) {
        return json;
    } else {
        instanceMap = Reflect.getMetadata(apiMapInstanceName, instance);
    }

    if (baseClassName !== undefined) {
        const baseClassMap: { [id: string]: any } = Reflect.getMetadata(`${apiMap}${baseClassName}`, instance);
        instanceMap = { ...instanceMap, ...baseClassMap };
    }

    const instanceKeys: Array<string> = Object.keys(instance);
    Object.keys(instanceMap).forEach((key: string): void => {
        if (instanceKeys.includes(key)) {
            const data: any = convertPropertyToData(instance, key, instanceMap[key], removeUndefined);

            if (!removeUndefined || (removeUndefined && data !== undefined)) {
                json[instanceMap[key].name] = data;
            }
        }
    });

    return json;
}

/**
 * Function to convert class property to json data
 */
function convertPropertyToData(instance: Function, key: string, value: Metadata, removeUndefined: boolean): any {
    let property: any = instance[key];
    const type: Metadata = Reflect.getMetadata(designType, instance, key);
    const isArray: boolean = type.name.toLocaleLowerCase() === Type.Array;
    const predicate: Function = value['predicate'];
    const onSerialize: Function = value['onSerialize'];
    const propertyType: any = value['type'] || type;
    const isSerializableProperty: boolean = isSerializable(propertyType);

    if (onSerialize) {
        property = onSerialize(property);
    }

    if (property && (isSerializableProperty || predicate)) {
        if (isArray) {
            const array: Array<any> = [];
            property.forEach((d: any): void => {
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
 */
function convertDataToProperty(instance: Function, key: string, value: Metadata, data: any): any {
    const type: Metadata = Reflect.getMetadata(designType, instance, key);
    const isArray: boolean = type.name.toLowerCase() === Type.Array;
    const predicate: Function = value['predicate'];
    const onDeserialize: Function = value['onDeserialize'];
    let propertyType: any = value['type'] || type;
    const isSerializableProperty: boolean = isSerializable(propertyType);

    if (onDeserialize) {
        data = onDeserialize(data);
    }

    if (!isSerializableProperty && !predicate) {
        return castSimpleData(propertyType.name, data);
    }

    if (isArray) {
        const array: Array<any> = [];
        data.forEach((d: any): void => {
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
 * Function to test if a class has the serializable decorator (metadata)
 */
function isSerializable(type: any): boolean {
    return Reflect.hasOwnMetadata(apiMapSerializable, type);
}

/**
 * Function to transform the JsonProperty value into an object like {name: string, type: Function, transform: Transform}
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
