import 'reflect-metadata';
import { SerializableMetadata } from './serializable';
import { JsonPropertiesMetadata } from './json-property';

export class Reflection {
    static apiMap = 'api:map:';
    static apiMapSerializable = `${Reflection.apiMap}serializable`;
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

    static getSerializableMetadata(type: object): SerializableMetadata {
        return Reflect.getMetadata(Reflection.apiMapSerializable, type) as SerializableMetadata;
    }

    static getType(instance: object, key: string) {
        return Reflect.getMetadata(Reflection.designType, instance, key);
    }

    static isSerializable(type: object): boolean {
        return Reflect.hasOwnMetadata(Reflection.apiMapSerializable, type);
    }

    static setJsonPropertiesMetadata(value: any, instance: object): any {
        const key = `${Reflection.apiMap}${instance.constructor.name}`;
        return Reflect.defineMetadata(key, value, instance);
    }

    static setSerializable(value: any, target: object): void {
        Reflect.defineMetadata(Reflection.apiMapSerializable, value, target);
    }

    static setType(type: any, target: object, key: string): void {
        Reflect.defineMetadata(Reflection.designType, type, target, key);
    }
}
