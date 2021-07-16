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

    static getJsonPropertiesMetadata(instance: object, name?: string): JsonPropertiesMetadata {
        const key = `${Reflection.apiMap}${name || instance.constructor.name}`;
        return Reflect.getMetadata(key, instance);
    }

    static getParamTypes(target: object) {
        return Reflect.getMetadata(Reflection.designParamTypes, target);
    }

    static getJsonObjectMetadata(type: object): JsonObjectMetadata {
        return Reflect.getMetadata(Reflection.apiMapJsonObject, type) as JsonObjectMetadata;
    }

    static getType(instance: object, key: string) {
        return Reflect.getMetadata(Reflection.designType, instance, key);
    }

    static isJsonObject(type: object): boolean {
        return Reflect.hasOwnMetadata(Reflection.apiMapJsonObject, type);
    }

    static setJsonPropertiesMetadata(value: any, instance: object): any {
        const key = `${Reflection.apiMap}${instance.constructor.name}`;
        return Reflect.defineMetadata(key, value, instance);
    }

    static setJsonObject(value: any, target: object): void {
        Reflect.defineMetadata(Reflection.apiMapJsonObject, value, target);
    }

    static setType(type: any, target: object, key: string): void {
        Reflect.defineMetadata(Reflection.designType, type, target, key);
    }
}
