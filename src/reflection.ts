import 'reflect-metadata';
import { JsonObjectMetadata } from './json-object';
import { JsonPropertiesMetadata } from './json-property';

export class Reflection {
    static apiMap = 'api:map:';
    static apiMapJsonObject = `${Reflection.apiMap}jsonObject`;
    static designType = 'design:type';
    static designParamTypes = 'design:paramtypes';
    static apiMapJsonObjectChildClass = `${Reflection.apiMap}jsonObjectChildClass:`;

    static getBaseClass(target: object): Function | undefined {
        return target ? (Reflect.getPrototypeOf(target) as Function) : undefined;
    }

    static getJsonPropertiesMetadata(
        target: object,
        name?: string
    ): JsonPropertiesMetadata | undefined {
        if (!target) {
            return undefined;
        }

        const key = `${Reflection.apiMap}${name || target.constructor.name}`;
        return Reflect.getMetadata(key, target);
    }

    static getParamTypes(target: object): any | undefined {
        return target ? Reflect.getMetadata(Reflection.designParamTypes, target) : undefined;
    }

    static getJsonObjectMetadata(type: object): JsonObjectMetadata | undefined {
        return type
            ? (Reflect.getMetadata(Reflection.apiMapJsonObject, type) as JsonObjectMetadata)
            : undefined;
    }

    static getType(target: object, key: string): any | undefined {
        return target ? Reflect.getMetadata(Reflection.designType, target, key) : undefined;
    }

    static getJsonObjectChildClass(target: Function): any | undefined {
        return target
            ? Reflect.getMetadata(`${Reflection.apiMapJsonObjectChildClass}${target.name}`, target)
            : undefined;
    }

    static isJsonObject(type: object): boolean {
        return type ? Reflect.hasOwnMetadata(Reflection.apiMapJsonObject, type) : false;
    }

    static setJsonPropertiesMetadata(value: JsonPropertiesMetadata, target: object): void {
        if (!target) {
            return;
        }

        const key = `${Reflection.apiMap}${target.constructor.name}`;
        Reflect.defineMetadata(key, value, target);
    }

    static setJsonObjectMetadata(value: JsonObjectMetadata, target: object): void {
        if (!target) {
            return;
        }

        Reflect.defineMetadata(Reflection.apiMapJsonObject, value, target);
    }

    static setType(type: any, target: object, key: string): void {
        if (!target || !type) {
            return;
        }

        Reflect.defineMetadata(Reflection.designType, type, target, key);
    }

    static setJsonObjectChildClass(value: object, target: Function): void {
        if (!target) {
            return;
        }

        Reflect.defineMetadata(
            `${Reflection.apiMapJsonObjectChildClass}${target.name}`,
            value,
            target
        );
    }
}
