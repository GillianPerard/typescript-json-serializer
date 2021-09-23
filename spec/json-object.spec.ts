import { Animal, Dummy, Panther, Zoo } from '../examples';

describe('JsonObject', () => {
    it('should return no metadata', () => {
        const hasMetadata = Reflect.hasOwnMetadata('api:map:jsonObject', Dummy);
        expect(hasMetadata).toBe(false);
    });

    it('should return metadata with no base class names', () => {
        const hasMetadata = Reflect.hasOwnMetadata('api:map:jsonObject', Zoo);
        const metadata = Reflect.getOwnMetadata('api:map:jsonObject', Zoo);
        expect(hasMetadata).toBe(true);
        expect(metadata).toEqual({ baseClassNames: [] });
    });

    it('should return metadata with 1 base class name', () => {
        const hasMetadata = Reflect.hasOwnMetadata('api:map:jsonObject', Animal);
        const metadata = Reflect.getOwnMetadata('api:map:jsonObject', Animal);
        expect(hasMetadata).toBe(true);
        expect(metadata).toEqual({ baseClassNames: ['LivingBeing'] });
    });

    it('should return metadata with 2 base class names', () => {
        const hasMetadata = Reflect.hasOwnMetadata('api:map:jsonObject', Panther);
        const metadata = Reflect.getOwnMetadata('api:map:jsonObject', Panther);
        expect(hasMetadata).toBe(true);
        expect(metadata).toEqual({ baseClassNames: ['LivingBeing', 'Animal'] });
    });
});
