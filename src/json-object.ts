import { Reflection } from './reflection';

export type FormatPropertyNameProto = (propertyName: string) => string;

export interface JsonObjectOptions {
    formatPropertyNames: FormatPropertyNameProto;
}

export interface JsonObjectMetadata {
    baseClassNames: Array<string>;
    options?: JsonObjectOptions;
}

const getBaseClassNames = (target: Object): Array<string> => {
    const baseClass = Reflection.getBaseClass(target);
    return baseClass && baseClass.name ? [...getBaseClassNames(baseClass), baseClass.name] : [];
};

export const JsonObject =
    (options?: JsonObjectOptions): Function =>
    (target: Object) => {
        const baseClassNames = getBaseClassNames(target);
        Reflection.setJsonObject({ baseClassNames, options }, target);
    };
