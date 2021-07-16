import { PropertyType } from './property-type';
import { Reflection } from './reflection';

export type IOProto = (property: any, currentInstance?: any) => any;
export type PredicateProto = (property: any, parentProperty?: any) => any;

export interface BeforeAfterProto {
    beforeSerialize?: IOProto;
    afterSerialize?: IOProto;
    beforeDeserialize?: IOProto;
    afterDeserialize?: IOProto;
}

export type JsonPropertyBaseMetadata = {
    required?: boolean;
} & BeforeAfterProto;

export interface JsonPropertiesMetadata {
    [id: string]: JsonPropertyMetadata;
}

export type JsonPropertyMetadata =
    | ({
          name: string;
          type?: Function;
          isDictionary?: boolean;
          isNameOverridden: boolean;
      } & JsonPropertyBaseMetadata)
    | ({
          name: string;
          predicate: PredicateProto;
          isDictionary?: boolean;
          isNameOverridden: boolean;
      } & JsonPropertyBaseMetadata)
    | ({
          names: Array<string>;
          type: Function;
      } & JsonPropertyBaseMetadata)
    | ({
          names: Array<string>;
          predicate: PredicateProto;
      } & JsonPropertyBaseMetadata);

type JsonPropertyOptions =
    | string
    | ({
          name?: string;
          type?: Function;
          isDictionary?: boolean;
      } & JsonPropertyBaseMetadata)
    | ({
          name?: string;
          predicate?: PredicateProto;
          isDictionary?: boolean;
      } & JsonPropertyBaseMetadata)
    | ({
          names: Array<string>;
          type?: Function;
      } & JsonPropertyBaseMetadata)
    | ({
          names: Array<string>;
          predicate?: PredicateProto;
      } & JsonPropertyBaseMetadata);

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
    options?: JsonPropertyOptions
): JsonPropertyMetadata => {
    if (!options) {
        return {
            name: key.toString(),
            isNameOverridden: false
        } as JsonPropertyMetadata;
    }

    let metadata: any;
    if (typeof options === PropertyType.String) {
        metadata = { name: options, isNameOverridden: true };
    } else if (options['name']) {
        metadata = { name: options['name'], isNameOverridden: true };
    } else if (options['names'] && options['names'].length) {
        metadata = { names: options['names'] };
    } else {
        metadata = { name: key.toString(), isNameOverridden: false };
    }

    const optionalMetadataKeys = [
        'isDictionary',
        'required',
        'beforeSerialize',
        'afterSerialize',
        'beforeDeserialize',
        'afterDeserialize'
    ];

    optionalMetadataKeys.forEach(k => {
        if (options[k] !== undefined && options[k] !== null) {
            metadata[k] = options[k];
        }
    });

    if (options['predicate']) {
        metadata.predicate = options['predicate'];
    } else if (options['type']) {
        metadata.type = options['type'];
    }

    return metadata as JsonPropertyMetadata;
};

export const JsonProperty =
    (options?: JsonPropertyOptions): Function =>
    (target: Object | Function, key: string, index: number): void => {
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
