import { isObject, isPredicate, isString } from './helpers';
import { Reflection } from './reflection';

export type IOProto = (property: any, currentInstance?: any) => any;
export type PredicateProto = (property: any, parentProperty?: any) => any;

export interface JsonPropertyBaseMetadata {
    isDictionary?: boolean;
    required?: boolean;
    beforeSerialize?: IOProto;
    afterSerialize?: IOProto;
    beforeDeserialize?: IOProto;
    afterDeserialize?: IOProto;
}

export interface JsonPropertiesMetadata {
    [id: string]: JsonPropertyMetadata;
}

export type JsonPropertyMetadata =
    | {
          isNameOverridden?: boolean;
          name: string | Array<string>;
          type?: Function;
          predicate?: PredicateProto;
      } & JsonPropertyBaseMetadata;

type JsonPropertyOptions =
    | {
          name?: string | Array<string>;
          type?: Function | PredicateProto;
      } & JsonPropertyBaseMetadata;

export const JsonProperty =
    (options?: string | JsonPropertyOptions): Function =>
    (target: object | Function, key: string, index: number): void => {
        if (key === undefined && target['prototype']) {
            const type: Function = Reflection.getParamTypes(target)[index];
            const keys = extractPropertiesFromConstructor(target['prototype'].constructor);
            key = keys.get(index) as string;
            target = target['prototype'];
            Reflection.setType(type, target, key);
        }

        const metadata = Reflection.getJsonPropertiesMetadata(target) ?? {};
        metadata[key] = buildJsonPropertyMetadata(key, options);
        Reflection.setJsonPropertiesMetadata(metadata, target);
    };

const extractPropertiesFromConstructor = (ctor: object): Map<number, string> => {
    // Clean constructor
    const ctorWithoutClassBody = ctor.toString().split('}')[0];
    const ctorWithoutComments = ctorWithoutClassBody.replace(/(\/\*[\s\S]*?\*\/|\/\/.*$)/gm, '');
    const ctorOnSingleLine = ctorWithoutComments.replace(/[\r\t\n\v\f ]/g, '');

    // Parse function body
    const constructorParamPattern = /(?:.*(?:constructor|function).*?(?=\())(?:\()(.+?(?=\)))/m;
    const propertyPattern = /(?:this\.)([^,;\n}]+)/gm;
    const properties = new Map<number, string>();
    const paramsExecArray = constructorParamPattern.exec(ctorOnSingleLine);

    if (!paramsExecArray || !paramsExecArray.length) {
        return properties;
    }

    const params = paramsExecArray[1].split(',');

    // Get properties
    let match: RegExpExecArray | null;
    while ((match = propertyPattern.exec(ctorOnSingleLine))) {
        const matchResult = match[1].split('=');
        const index = params.findIndex(param => param === matchResult[1]);

        if (index > -1) {
            properties.set(index, matchResult[0]);
        }
    }

    return properties;
};

const buildJsonPropertyMetadata = (
    key: string,
    options?: string | JsonPropertyOptions
): JsonPropertyMetadata => {
    let metadata: JsonPropertyMetadata = { name: key.toString() };

    if (!options) {
        return metadata;
    }

    if (isString(options)) {
        metadata.name = options;
        metadata.isNameOverridden = true;
        return metadata;
    }

    if (isObject(options)) {
        metadata = { ...metadata, ...options };

        if (options.name) {
            metadata.name = options.name;
            metadata.isNameOverridden = true;
        }

        if (isPredicate(options.type)) {
            metadata.type = undefined;
            metadata.predicate = options.type;
        }
    }

    return metadata;
};
