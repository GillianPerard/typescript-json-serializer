import 'reflect-metadata';
import { JsonObjectMetadata } from './json-object';
import { JsonPropertiesMetadata } from './json-property';

export class Reflection {
    static apiMap = 'api:map:';
    static apiMapJsonObject = `${Reflection.apiMap}jsonObject`;
    static designType = 'design:type';
    static designParamTypes = 'design:paramtypes';

    static getBaseClass(target: object): { name: string } {
        return Reflect.getPrototypeOf(target) as { name: string };
    }

    static getJsonPropertiesMetadata(target: object, name?: string): JsonPropertiesMetadata {
        const key = `${Reflection.apiMap}${name || target.constructor.name}`;
        return Reflect.getMetadata(key, target);
    }

    static getParamTypes(target: object): any {
        return Reflect.getMetadata(Reflection.designParamTypes, target);
    }

    static getJsonObjectMetadata(type: object): JsonObjectMetadata {
        return Reflect.getMetadata(Reflection.apiMapJsonObject, type) as JsonObjectMetadata;
    }

    static getType(target: object, key: string) {
        return Reflect.getMetadata(Reflection.designType, target, key);
    }

    static isJsonObject(type: object): boolean {
        return Reflect.hasOwnMetadata(Reflection.apiMapJsonObject, type);
    }

    static setJsonPropertiesMetadata(value: JsonPropertiesMetadata, target: object): void {
        const key = `${Reflection.apiMap}${target.constructor.name}`;
        Reflect.defineMetadata(key, value, target);
    }

    static setJsonObject(value: JsonObjectMetadata, target: object): void {
        Reflect.defineMetadata(Reflection.apiMapJsonObject, value, target);
    }

    static setType(type: any, target: object, key: string): void {
        Reflect.defineMetadata(Reflection.designType, type, target, key);
    }
}
