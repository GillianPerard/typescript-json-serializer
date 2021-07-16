import { FormatPropertyNameProto } from './json-object';
import {
    IOProto,
    JsonPropertiesMetadata,
    JsonPropertyMetadata,
    PredicateProto
} from './json-property';
import { PropertyType } from './property-type';
import { Reflection } from './reflection';

export const deserialize = <T>(json: any, type: new (...params: Array<any>) => T): T => {
    if ([null, undefined].includes(json)) {
        return json as never;
    }

    if (type === undefined) {
        return castSimpleData(typeof json, json);
    }

    if (typeof json === PropertyType.String) {
        json = JSON.parse(json);
    }

    const instance: any = new type({});
    const { baseClassNames, options } = Reflection.getSerializableMetadata(type) ?? {};
    let instanceMap = Reflection.getJsonPropertiesMetadata(instance);

    if (!instanceMap && (!baseClassNames || !baseClassNames.length)) {
        return instance;
    }

    if (baseClassNames && baseClassNames.length) {
        const baseClassMetadataMaps = getClassesJsonPropertiesMetadata(baseClassNames, instance);
        instanceMap = mergeJsonPropertiesMetadata(...baseClassMetadataMaps, instanceMap);
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
            const instanceName = instance.constructor.name;
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

export const serialize = (instance: any, removeUndefined: boolean = true): any => {
    if ([undefined, null].includes(instance) || typeof instance !== PropertyType.Object) {
        return instance;
    }

    const { baseClassNames, options } =
        Reflection.getJsonObjectMetadata(instance.constructor) ?? {};
    const hasBaseClasses = baseClassNames && baseClassNames.length;
    let instanceMap = Reflection.getJsonPropertiesMetadata(instance);

    if (!instanceMap && !hasBaseClasses) {
        return instance;
    }

    if (hasBaseClasses) {
        const baseClassMetadataMaps = getClassesJsonPropertiesMetadata(baseClassNames, instance);
        instanceMap = mergeJsonPropertiesMetadata(...baseClassMetadataMaps, instanceMap);
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

            let data = convertPropertyToData(instance, key, metadata, removeUndefined);

            if (afterSerialize) {
                data = afterSerialize(data, instance);
            }

            instance[key] = initialValue || instance[key];

            if (Array.isArray(metadata.name)) {
                metadata.name.forEach((name: string) => {
                    if (!removeUndefined || (removeUndefined && data[name] !== undefined)) {
                        json[name] = data[name];
                    }
                });
            } else {
                if (!removeUndefined || (removeUndefined && data !== undefined)) {
                    if (!metadata.isNameOverridden && options?.formatPropertyNames) {
                        const name = options.formatPropertyNames(metadata.name);
                        json[name] = data;
                    } else {
                        json[metadata.name] = data;
                    }
                }
            }
        }
    });

    return json;
};

const convertPropertyToData = (
    instance: Function,
    key: string,
    metadata: JsonPropertyMetadata,
    removeUndefined: boolean
): any => {
    const property: any = instance[key];
    const type: any = Reflection.getType(instance, key);
    const isArray = type.name ? type.name.toLocaleLowerCase() === PropertyType.Array : false;
    const predicate: PredicateProto = metadata['predicate'];
    const propertyType: any = metadata['type'] || type;
    const isJsonObject = Reflection.isJsonObject(propertyType);

    if (property && (isJsonObject || predicate)) {
        if (isArray) {
            return property.map((d: any) => serialize(d, removeUndefined));
        }

        if (metadata['isDictionary']) {
            const obj = {};
            Object.keys(property).forEach(k => {
                obj[k] = serialize(property[k], removeUndefined);
            });

            return obj;
        }

        return serialize(property, removeUndefined);
    }

    if (
        propertyType.name.toLocaleLowerCase() === PropertyType.Date &&
        typeof property === PropertyType.Object
    ) {
        return property.toISOString();
    }

    return property;
};

const convertDataToProperty = (
    instance: Function,
    key: string,
    metadata: JsonPropertyMetadata,
    json: any,
    formatPropertyName?: FormatPropertyNameProto
) => {
    let data: any;

    if ([null, undefined].includes(json)) {
        return json;
    }

    if (Array.isArray(metadata.name)) {
        data = {};
        metadata.name.forEach((name: string) => (data[name] = json[name]));
    } else if (!metadata.isNameOverridden && formatPropertyName) {
        const name = formatPropertyName(metadata.name);
        data = json[name];
    } else {
        data = json[metadata.name];
    }

    if ([null, undefined].includes(data)) {
        return data;
    }

    const type: any = Reflection.getType(instance, key);
    const isArray = type.name ? type.name.toLowerCase() === PropertyType.Array : false;
    const isDictionary = metadata['isDictionary'];
    const predicate: PredicateProto = metadata['predicate'];
    const beforeDeserialize: IOProto | undefined = metadata['beforeDeserialize'];
    const afterDeserialize: IOProto | undefined = metadata['afterDeserialize'];
    let propertyType: any = metadata['type'] || type;
    const isJsonObject = Reflection.isJsonObject(propertyType);
    let result: any;

    if (beforeDeserialize) {
        data = beforeDeserialize(data, instance);
    }

    if (isDictionary) {
        const obj = {};

        if (typeof data !== PropertyType.Object) {
            console.error(
                `Type '${typeof data}' is not assignable to type 'Dictionary' for property '${key}' in '${
                    instance.constructor.name
                }'.\n`,
                `Received: ${JSON.stringify(data)}`
            );
            result = undefined;
        } else {
            Object.keys(data).forEach(k => {
                if (!isJsonObject && !predicate) {
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
                if (!isJsonObject && !predicate) {
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
    } else if (!isJsonObject && !predicate) {
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
        case PropertyType.String:
            const string = data.toString();

            if (string === '[object Object]') {
                logError();
                return undefined;
            }

            return string;
        case PropertyType.Number:
            const number: number = +data;

            if (isNaN(number)) {
                logError();
                return undefined;
            }

            return number;
        case PropertyType.Boolean:
            logError();
            return undefined;
        case PropertyType.Date:
            if (isNaN(Date.parse(data))) {
                logError();
                return undefined;
            }

            return new Date(data);
        default:
            return data;
    }
};

const getClassesJsonPropertiesMetadata = (
    classNames: Array<string>,
    instance: any
): Array<JsonPropertiesMetadata> =>
    classNames.map(className => Reflection.getJsonPropertiesMetadata(instance, className));

const mergeJsonPropertiesMetadata = (
    ...metadataMaps: Array<JsonPropertiesMetadata>
): JsonPropertiesMetadata => {
    const jsonPropertiesMetadata: JsonPropertiesMetadata = {};

    metadataMaps.forEach(metadataMap => {
        if (metadataMap) {
            Object.keys(metadataMap).forEach(key => {
                jsonPropertiesMetadata[key] = {
                    ...jsonPropertiesMetadata[key],
                    ...metadataMap[key]
                };
            });
        }
    });

    return jsonPropertiesMetadata;
};
