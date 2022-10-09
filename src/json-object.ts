import { Reflection } from './reflection';

export interface JsonObjectMetadata {
    baseClassNames: Array<string>;
    autoPredicate?: boolean;
}

const getBaseClassNames = (target: Object): Array<string> => {
    const baseClass = Reflection.getBaseClass(target) as { name: string };
    return baseClass && baseClass.name ? [...getBaseClassNames(baseClass), baseClass.name] : [];
};

export const getBaseClasses = (target: Object): Array<Function> => {
    const baseClass = Reflection.getBaseClass(target);
    return baseClass && baseClass.name ? [...getBaseClasses(baseClass), baseClass] : [];
};

interface JsonObjectOptions {
    autoPredicate?: boolean;
}

export const JsonObject =
    (options?: JsonObjectOptions): Function =>
    (target: Object) => {
        const baseClassNames = getBaseClassNames(target);
        Reflection.setJsonObjectMetadata(
            { baseClassNames, autoPredicate: options ? options.autoPredicate : undefined },
            target
        );

        const baseClasses = getBaseClasses(target);
        baseClasses.forEach(baseClass => {
            const children = Reflection.getJsonObjectChildClass(baseClass);
            const newChildren = children ? children.concat([target]) : [target];
            Reflection.setJsonObjectChildClass(newChildren, baseClass);
        });
    };
