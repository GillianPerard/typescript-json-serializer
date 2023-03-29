import { Reflection } from './reflection';

export interface JsonObjectMetadata {
    baseClassNames: Array<string>;
    constructorParams: Array<unknown>;
}

export interface JsonObjectOptions {
    constructorParams?: Array<unknown>;
}

const getBaseClassNames = (target: Object): Array<string> => {
    const baseClass = Reflection.getBaseClass(target);
    return baseClass && baseClass.name ? [...getBaseClassNames(baseClass), baseClass.name] : [];
};

export const JsonObject =
    (options?: JsonObjectOptions): Function =>
    (target: Object) => {
        const baseClassNames = getBaseClassNames(target);
        const constructorParams = options?.constructorParams ?? [];
        Reflection.setJsonObject({ baseClassNames, constructorParams }, target);
    };
