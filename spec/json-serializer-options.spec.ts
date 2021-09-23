import { Organization } from '../examples';
import { JsonSerializer, throwError } from '../src';

describe('ErrorCallback', () => {
    const organization: any = 4;
    let jsonSerializer = new JsonSerializer();
    const fn = () => jsonSerializer.deserializeObject(organization, Organization);

    it('should log an error', () => {
        console.error = jest.fn();
        fn();
        expect(fn).not.toThrowError();
        expect(console.error).toHaveBeenCalled();
    });

    it('should throw an error', () => {
        console.error = jest.fn();
        jsonSerializer.options.errorCallback = throwError;
        expect(fn).toThrowError();
        expect(console.error).not.toHaveBeenCalled();
    });

    it('should return undefined', () => {
        console.error = jest.fn();
        jsonSerializer = new JsonSerializer({ errorCallback: undefined });
        const result = fn();
        expect(fn).not.toThrowError();
        expect(console.error).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
    });
});
