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
    Object = 'object',
    String = 'string'
}

interface SerializableMetadata {
    baseClassNames: Array<string>;
    options?: SerializableOptions;
}

interface RemoveValues {
    undefined?: boolean;
    null?: boolean;
}
interface SerializableOptions {
    formatPropertyNames: FormatPropertyNameProto;
}

type IOProto = (property: any, currentInstance?: any) => any;
type PredicateProto = (property: any, parentProperty?: any) => any;
type FormatPropertyNameProto = (propertyName: string) => string;
interface BeforeAfterProto {
    beforeSerialize?: IOProto;
    afterSerialize?: IOProto;
    beforeDeserialize?: IOProto;
    afterDeserialize?: IOProto;
}
type BaseMetadata = {
    required?: boolean;
} & BeforeAfterProto;

// Types
type Args =
    | string
    | ({
          name?: string;
          type?: Function;
          isDictionary?: boolean;
      } & BaseMetadata)
    | ({
          name?: string;
          predicate?: PredicateProto;
          isDictionary?: boolean;
      } & BaseMetadata)
    | ({
          names: Array<string>;
          type?: Function;
      } & BaseMetadata)
    | ({
          names: Array<string>;
          predicate?: PredicateProto;
      } & BaseMetadata);

type Metadata =
    | ({
          name: string;
          type?: Function;
          isDictionary?: boolean;
          isNameOverridden: boolean;
      } & BaseMetadata)
    | ({
          name: string;
          predicate: PredicateProto;
          isDictionary?: boolean;
          isNameOverridden: boolean;
      } & BaseMetadata)
    | ({
          names: Array<string>;
          type: Function;
      } & BaseMetadata)
    | ({
          names: Array<string>;
          predicate: PredicateProto;
      } & BaseMetadata);

interface MetadataMap {
    [id: string]: Metadata;
}

/**
 * Function to get all base class names recursively
 *
 * @param {Object} target The target class from which the parent classes are extracted
 * @returns {Array<string>} All the base class names
 */
const getBaseClassNames = (target: Object): Array<string> => {
    const baseClass = Reflect.getPrototypeOf(target);

    if (!baseClass || !baseClass['name']) {
        return [];
    }

    return [...getBaseClassNames(baseClass), baseClass['name']];
};

/**
 * Function to find the name of function properties
 *
 * @param {object} ctor The constructor from which the properties are extracted
 * @returns {Array<string>} All the property names
 */
const getPropertyNames = (ctor: object): Map<number, string> => {
    // Remove all kind of comments
    const ctorWithoutClassBody = ctor.toString().split('}')[0];
    const ctorWithoutComments = ctorWithoutClassBody.replace(/(\/\*[\s\S]*?\*\/|\/\/.*$)/gm, '');
    const ctorOnSingleLine = ctorWithoutComments.replace(/[\r\t\n\v\f ]/g, '');

    // Parse function body
    const constructorParamPattern = /(?:.*(?:constructor|function).*?(?=\())(?:\()(.+?(?=\)))/m;
    const propertyPattern = /(?:this\.)([^,;\n}]+)/gm;
    const propertyNames = new Map<number, string>();
    const paramsExecArray = constructorParamPattern.exec(ctorOnSingleLine);

    if (!paramsExecArray || !paramsExecArray.length) {
        return propertyNames;
    }

    const params = paramsExecArray[1].split(',');

    // Get params
    let match: RegExpExecArray | null;
    while ((match = propertyPattern.exec(ctorOnSingleLine))) {
        const matchResult = match[1].split('=');
        const index = params.findIndex(param => param === matchResult[1]);

        if (index > -1) {
            propertyNames.set(index, matchResult[0]);
        }
    }

    return propertyNames;
};

/**
 * Decorator to take the property in account during the serialize and deserialize function
 *
 * @param {Args=} args Arguments to describe the property
 */

export const JsonProperty =
    (args?: Args): Function =>
    (target: Object | Function, key: string, index: number): void => {
        if (key === undefined && target['prototype']) {
            const type: Function = Reflect.getMetadata(designParamTypes, target)[index];
            const keys = getPropertyNames(target['prototype'].constructor);
            key = keys.get(index) as string;
            target = target['prototype'];
            Reflect.defineMetadata(designType, type, target, key);
        }

        let map: MetadataMap = {};
        const targetName = target.constructor.name;
        const apiMapTargetName = `${apiMap}${targetName}`;

        if (Reflect.hasMetadata(apiMapTargetName, target)) {
            map = Reflect.getMetadata(apiMapTargetName, target);
        }

        map[key] = getMetadata(key, args as Args);
        Reflect.defineMetadata(apiMapTargetName, map, target);
    };

/**
 * Decorator to make a class Serializable
 *
 * @param {{formatPropertyNames: FormatPropertyNameProto}=} options The options of the serializable class
 *
 * BREAKING CHANGE: Since version 2.0.0 the parameter `baseClassName` is not needed anymore
 */
export const Serializable =
    (options?: SerializableOptions): Function =>
    (target: Object) => {
        const baseClassNames = getBaseClassNames(target);
        Reflect.defineMetadata(apiMapSerializable, { baseClassNames, options }, target);
    };

/**
 * Function to retrieve all base class metadata
 *
 * @param baseClassNames The base classe names of the instance provided
 * @param {any} instance The instance target from which the parents metadata are extracted
 * @returns {MetadataMap} All base class metadata
 */
const getBaseClassMetadataMaps = (
    baseClassNames: Array<string>,
    instance: any
): Array<MetadataMap> =>
    baseClassNames.map(baseClassName => Reflect.getMetadata(`${apiMap}${baseClassName}`, instance));

/**
 * Function to merge metadata maps
 *
 * @param metadataMaps The metadata maps to merge
 * @returns The new metadata map created from the merge of all metadata maps provided
 */
const mergeMetadataMap = (...metadataMaps: Array<MetadataMap>): MetadataMap => {
    const mergedMetadataMap: MetadataMap = {};

    metadataMaps.forEach(metadataMap => {
        if (metadataMap) {
            Object.keys(metadataMap).forEach(key => {
                mergedMetadataMap[key] = { ...mergedMetadataMap[key], ...metadataMap[key] };
            });
        }
    });

    return mergedMetadataMap;
};

/**
 * Function to deserialize json into a class
 *
 * @param {object} json The json to deserialize
 * @param {new (...params: Array<any>) => T} type The class in which we want to deserialize
 * @returns {T} The instance of the specified type containing all deserialized properties
 */
export const deserialize = <T>(json: any, type: new (...params: Array<any>) => T): T => {
    if ([null, undefined].includes(json)) {
        return json as never;
    }

    if (type === undefined) {
        return castSimpleData(typeof json, json);
    }

    if (typeof json === Type.String) {
        json = JSON.parse(json);
    }

    const instance: any = new type();
    const instanceName: string = instance.constructor.name;
    const { baseClassNames, options } =
        (Reflect.getMetadata(apiMapSerializable, type) as SerializableMetadata) ?? {};
    const apiMapInstanceName = `${apiMap}${instanceName}`;
    const hasMap = Reflect.hasMetadata(apiMapInstanceName, instance);
    let instanceMap: MetadataMap = {};

    if (!hasMap && (!baseClassNames || !baseClassNames.length)) {
        return instance;
    }

    instanceMap = Reflect.getMetadata(apiMapInstanceName, instance);

    if (baseClassNames && baseClassNames.length) {
        const baseClassMetadataMaps = getBaseClassMetadataMaps(baseClassNames, instance);
        instanceMap = mergeMetadataMap(...baseClassMetadataMaps, instanceMap);
    }

    Object.keys(instanceMap).forEach(key => {
        const property = convertDataToProperty(
            instance,
            key,
            instanceMap[key],
            json,
            options?.formatPropertyNames
        );

        if ((property === undefined || property === null) && instanceMap[key].required) {
            throw new Error(
                `Property '${key}' is required in ${instanceName} ${JSON.stringify(json)}.`
            );
        }

        if (property !== undefined) {
            instance[key] = property;
        }
    });

    return instance;
};

/**
 * Function to serialize a class into json
 *
 * @param {any} instance Instance of the object to deserialize
 * @param {RemoveValues} remove Indicates if you want to keep or remove undefined or null values
 * @returns {any} The json object
 */
export const serialize = (instance: any, remove: RemoveValues = { undefined: true, null: false }): any => {
    if ([undefined, null].includes(instance) || typeof instance !== Type.Object) {
        return instance;
    }

    const instanceName = instance.constructor.name;
    const apiMapInstanceName = `${apiMap}${instanceName}`;
    const { baseClassNames, options } =
        (Reflect.getMetadata(apiMapSerializable, instance.constructor) as SerializableMetadata) ??
        {};
    const hasBaseClasses = baseClassNames && baseClassNames.length;

    const hasMap = Reflect.hasMetadata(apiMapInstanceName, instance);
    let instanceMap: MetadataMap = {};

    if (!hasMap && !hasBaseClasses) {
        return instance;
    }

    instanceMap = Reflect.getMetadata(apiMapInstanceName, instance);

    if (hasBaseClasses) {
        const baseClassMetadataMaps = getBaseClassMetadataMaps(baseClassNames, instance);
        instanceMap = mergeMetadataMap(...baseClassMetadataMaps, instanceMap);
    }

    const json: any = {};
    const instanceKeys = Object.keys(instance);

    Object.keys(instanceMap).forEach(key => {
        if (instanceKeys.includes(key)) {
            const metadata = instanceMap[key];
            const beforeSerialize: IOProto | undefined = metadata['beforeSerialize'];
            const afterSerialize: IOProto | undefined = metadata['afterSerialize'];

            let initialValue: any;

            if (beforeSerialize) {
                initialValue = instance[key];
                instance[key] = beforeSerialize(instance[key], instance);
            }

            let data = convertPropertyToData(instance, key, metadata, remove);

            if (afterSerialize) {
                data = afterSerialize(data, instance);
            }

            instance[key] = initialValue || instance[key];

            if (metadata['names']) {
                metadata['names'].forEach((name: string) => {
                    if (
                        (!remove.undefined || (remove.undefined && data[name] !== undefined)) &&
                        (!remove.null || (remove.null && data[name] !== null))
                    ) {
                        json[name] = data[name];
                    }
                });
            } else {
                if (
                    (!remove.undefined || (remove.undefined && data !== undefined)) &&
                    (!remove.null || (remove.null && data !== null))
                ) {
                    if (!metadata['isNameOverridden'] && options?.formatPropertyNames) {
                        const name = options.formatPropertyNames(metadata['name']);
                        json[name] = data;
                    } else {
                        json[metadata['name']] = data;
                    }
                }
            }
        }
    });

    return json;
};

/**
 * Function to convert class property to json data
 *
 * @param {Function} instance The instance containing the property to convert
 * @param {string} key The name of the property to convert
 * @param {Metadata} metadata The metadata of the property to convert
 * @param {RemoveValues} remove Indicates if you want to keep or remove undefined or null values
 * @returns {any} The converted property
 */
const convertPropertyToData = (
    instance: Function,
    key: string,
    metadata: Metadata,
    remove: RemoveValues
): any => {
    const property: any = instance[key];
    const type: any = Reflect.getMetadata(designType, instance, key);
    const isArray = type.name ? type.name.toLocaleLowerCase() === Type.Array : false;
    const predicate: PredicateProto = metadata['predicate'];
    const propertyType: any = metadata['type'] || type;
    const isSerializableProperty = isSerializable(propertyType);

    if (property && (isSerializableProperty || predicate)) {
        if (isArray) {
            return property.map((d: any) => serialize(d, remove));
        }

        if (metadata['isDictionary']) {
            const obj = {};
            Object.keys(property).forEach(k => {
                obj[k] = serialize(property[k], remove);
            });

            return obj;
        }

        return serialize(property, remove);
    }

    if (propertyType.name.toLocaleLowerCase() === Type.Date && typeof property === Type.Object) {
        return property.toISOString();
    }

    return property;
};

/**
 * Function to convert json data to the class property
 *
 * @param {Function} instance The instance containing the property to convert
 * @param {string} key The name of the property to convert
 * @param {Metadata} metadata The metadata of the property to convert
 * @param {any} json Json containing the values
 */
const convertDataToProperty = (
    instance: Function,
    key: string,
    metadata: Metadata,
    json: any,
    formatPropertyName?: FormatPropertyNameProto
) => {
    let data: any;

    if ([null, undefined].includes(json)) {
        return json;
    }

    if ('names' in metadata) {
        const object = {};
        metadata.names.forEach((name: string) => (object[name] = json[name]));
        data = object;
    } else if ('name' in metadata && !metadata.isNameOverridden && formatPropertyName) {
        const name = formatPropertyName(metadata.name);
        data = json[name];
    } else {
        data = json[metadata.name];
    }

    if ([null, undefined].includes(data)) {
        return data;
    }

    const type: any = Reflect.getMetadata(designType, instance, key);
    const isArray = type.name ? type.name.toLowerCase() === Type.Array : false;
    const isDictionary = metadata['isDictionary'];
    const predicate: PredicateProto = metadata['predicate'];
    const beforeDeserialize: IOProto | undefined = metadata['beforeDeserialize'];
    const afterDeserialize: IOProto | undefined = metadata['afterDeserialize'];
    let propertyType: any = metadata['type'] || type;
    const isSerializableProperty = isSerializable(propertyType);
    let result: any;

    if (beforeDeserialize) {
        data = beforeDeserialize(data, instance);
    }

    if (isDictionary) {
        const obj = {};

        if (typeof data !== Type.Object) {
            console.error(
                `Type '${typeof data}' is not assignable to type 'Dictionary' for property '${key}' in '${
                    instance.constructor.name
                }'.\n`,
                `Received: ${JSON.stringify(data)}`
            );
            result = undefined;
        } else {
            Object.keys(data).forEach(k => {
                if (!isSerializableProperty && !predicate) {
                    obj[k] = castSimpleData(
                        typeof data[k],
                        data[k],
                        key,
                        instance.constructor.name
                    );
                } else {
                    if (predicate) {
                        propertyType = predicate(data[k], data);
                    }
                    obj[k] = deserialize(data[k], propertyType);
                }
            });
            result = obj;
        }
    } else if (isArray) {
        const array: Array<any> = [];

        if (!Array.isArray(data)) {
            console.error(
                `Type '${typeof data}' is not assignable to type 'Array' for property '${key}' in '${
                    instance.constructor.name
                }'.\n`,
                `Received: ${JSON.stringify(data)}`
            );
            result = undefined;
        } else {
            data.forEach((d: any) => {
                if (!isSerializableProperty && !predicate) {
                    array.push(castSimpleData(typeof d, d, key, instance.constructor.name));
                } else {
                    if (predicate) {
                        propertyType = predicate(d, data);
                    }
                    array.push(deserialize(d, propertyType));
                }
            });
            result = array;
        }
    } else if (!isSerializableProperty && !predicate) {
        result = castSimpleData(propertyType.name, data, key, instance.constructor.name);
    } else {
        propertyType = predicate ? predicate(data, json) : propertyType;
        result = deserialize(data, propertyType);
    }

    if (afterDeserialize) {
        result = afterDeserialize(result, instance);
    }

    return result;
};

/**
 * Function to test if a class is serializable
 *
 * @param {any} type The type to test
 * @returns {boolean} If the type is serializable or not
 */
const isSerializable = (type: any): boolean => Reflect.hasOwnMetadata(apiMapSerializable, type);

/**
 * Function to transform the JsonProperty value into Metadata
 *
 * @param {string} key The property name
 * @param {Args} args Arguments to describe the property
 * @returns {Metadata} The metadata object
 */
const getMetadata = (key: string, args: Args): Metadata => {
    if (!args) {
        return {
            name: key.toString(),
            isNameOverridden: false
        } as Metadata;
    }

    let metadata: any;
    if (typeof args === Type.String) {
        metadata = { name: args, isNameOverridden: true };
    } else if (args['name']) {
        metadata = { name: args['name'], isNameOverridden: true };
    } else if (args['names'] && args['names'].length) {
        metadata = { names: args['names'] };
    } else {
        metadata = { name: key.toString(), isNameOverridden: false };
    }

    const optionalArgKeys = [
        'isDictionary',
        'required',
        'beforeSerialize',
        'afterSerialize',
        'beforeDeserialize',
        'afterDeserialize'
    ];

    optionalArgKeys.forEach(k => {
        if (args[k] !== undefined && args[k] !== null) {
            metadata[k] = args[k];
        }
    });

    if (args['predicate']) {
        metadata.predicate = args['predicate'];
    } else if (args['type']) {
        metadata.type = args['type'];
    }

    return metadata as Metadata;
};

/**
 * Function to cast simple type data into the real class property type
 *
 * @param {string} type The type to cast data into
 * @param {any} data The data to cast
 * @returns {any} The casted data
 */
const castSimpleData = (
    type: string,
    data: any,
    propertyName?: string,
    className?: string
): any => {
    if (type === undefined || type === null) {
        return data;
    }

    type = type.toLowerCase();

    if ((typeof data).toLowerCase() === type) {
        return data;
    }

    const logError = () => {
        console.error(
            `Type '${typeof data}' is not assignable to type '${type}' for property '${propertyName}' in '${className}'.\n`,
            `Received: ${JSON.stringify(data)}`
        );
    };

    switch (type) {
        case Type.String:
            const string = data.toString();

            if (string === '[object Object]') {
                logError();
                return undefined;
            }

            return string;
        case Type.Number:
            const number: number = +data;

            if (isNaN(number)) {
                logError();
                return undefined;
            }

            return number;
        case Type.Boolean:
            logError();
            return undefined;
        case Type.Date:
            if (isNaN(Date.parse(data))) {
                logError();
                return undefined;
            }

            return new Date(data);
        default:
            return data;
    }
};
