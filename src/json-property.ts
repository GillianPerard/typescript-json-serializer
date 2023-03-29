import { isObject, isPredicate, isString } from './helpers';
import { Reflection } from './reflection';

export type IOProto = (property: any, currentInstance?: any) => any;
export type PredicateProto = (property: any, parentProperty?: any) => any;
export type DataStructure = 'array' | 'dictionary' | 'map' | 'set';

export interface JsonPropertyBaseMetadata {
    dataStructure?: DataStructure;
    required?: boolean;
    beforeSerialize?: IOProto;
    afterSerialize?: IOProto;
    beforeDeserialize?: IOProto;
    afterDeserialize?: IOProto;
}

export interface JsonPropertiesMetadata {
    [id: string]: JsonPropertyMetadata;
}

export interface JsonPropertyMetadata extends JsonPropertyBaseMetadata {
    isNameOverridden?: boolean;
    name: string | Array<string>;
    type?: Function;
    predicate?: PredicateProto;
}

export interface JsonPropertyOptions extends JsonPropertyBaseMetadata {
    name?: string | Array<string>;
    type?: Function | PredicateProto;
}

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

    const ctorLength = ctorOnSingleLine.length;
    let char: string | undefined;

    // When using React in production, 'this' in the constructor
    // is replaced by a char and appears at the end of it.
    if (ctorOnSingleLine[ctorLength - 2] === ',') {
        char = ctorOnSingleLine[ctorLength - 1];
    }

    // Parse function body
    const constructorParamPattern = /(?:.*(?:constructor|function).*?(?=\())(?:\()(.+?(?=\)))/m;
    const propertyPattern = char
        ? new RegExp(`(?:(this|${char}|\\(${char}=t.call\\(this(,.)*\\)\\))\\.)([^,;\n}]+)`, 'gm')
        : new RegExp(`(?:(this)\\.)([^,;\n}]+)`, 'gm');
    const properties = new Map<number, string>();
    const paramsExecArray = constructorParamPattern.exec(ctorOnSingleLine);

    if (!paramsExecArray || !paramsExecArray.length) {
        return properties;
    }

    const params = paramsExecArray[1].split(',');

    // Get properties
    let match: RegExpExecArray | null;
    while ((match = propertyPattern.exec(ctorOnSingleLine))) {
        const matchIndex = match.length - 1;
        const matchResult = match[matchIndex].split('=');
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
            delete metadata.type;
            metadata.predicate = options.type;
        }
    }

    return metadata;
};
