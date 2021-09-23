import { Reflection } from './reflection';

export interface JsonObjectMetadata {
    baseClassNames: Array<string>;
}

const getBaseClassNames = (target: Object): Array<string> => {
    const baseClass = Reflection.getBaseClass(target);
    return baseClass && baseClass.name ? [...getBaseClassNames(baseClass), baseClass.name] : [];
};

export const JsonObject = (): Function => (target: Object) => {
    const baseClassNames = getBaseClassNames(target);
    Reflection.setJsonObject({ baseClassNames }, target);
};
