import { Reflection } from '../src/reflection';

describe('Reflection', () => {
    const unknownTarget: any = undefined;

    it('getBaseClass should return undefined if there is no target', () => {
        expect(Reflection.getBaseClass(unknownTarget)).toBeUndefined();
    });

    it('getJsonPropertiesMetadata should return undefined if there is no target', () => {
        expect(Reflection.getJsonPropertiesMetadata(unknownTarget)).toBeUndefined();
    });

    it('getParamTypes should return undefined if there is no target', () => {
        expect(Reflection.getParamTypes(unknownTarget)).toBeUndefined();
    });

    it('getJsonObjectMetadata should return undefined if there is no target', () => {
        expect(Reflection.getJsonObjectMetadata(unknownTarget)).toBeUndefined();
    });

    it('getType should return undefined if there is no target', () => {
        expect(Reflection.getType(unknownTarget, 'test')).toBeUndefined();
    });

    it('isJsonObject should return undefined if there is no target', () => {
        expect(Reflection.isJsonObject(unknownTarget)).toBe(false);
    });

    it('setJsonPropertiesMetadata should not define metadata if there is no target', () => {
        const spy = jest.spyOn(Reflect, 'defineMetadata');
        Reflection.setJsonPropertiesMetadata({}, unknownTarget);
        expect(spy).not.toHaveBeenCalled();
    });

    it('setJsonObject should not define json object if there is no target', () => {
        const spy = jest.spyOn(Reflect, 'defineMetadata');
        Reflection.setJsonObject({ baseClassNames: [] }, unknownTarget);
        expect(spy).not.toHaveBeenCalled();
    });

    it('setType should not define type if there is no target', () => {
        const spy = jest.spyOn(Reflect, 'defineMetadata');
        Reflection.setType('test', unknownTarget, 'test');
        expect(spy).not.toHaveBeenCalled();
    });
});
