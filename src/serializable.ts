import { Reflection } from './reflection';

export type FormatPropertyNameProto = (propertyName: string) => string;

export interface SerializableOptions {
    formatPropertyNames: FormatPropertyNameProto;
}

export interface SerializableMetadata {
    baseClassNames: Array<string>;
    options?: SerializableOptions;
}

const getBaseClassNames = (target: Object): Array<string> => {
    const baseClass = Reflection.getBaseClass(target);
    return baseClass && baseClass.name ? [...getBaseClassNames(baseClass), baseClass.name] : [];
};

export const Serializable =
    (options?: SerializableOptions): Function =>
    (target: Object) => {
        const baseClassNames = getBaseClassNames(target);
        Reflection.setSerializable({ baseClassNames, options }, target);
    };
