import {
    difference,
    isArray,
    isBoolean,
    isDateObject,
    isDateValue,
    isNullish,
    isNumber,
    isObject,
    isString,
    tryParse
} from '../src/helpers';

const values = [
    undefined,
    null,
    4,
    '4',
    'test',
    false,
    true,
    new Date(),
    new Date().toISOString(),
    [],
    [4],
    {},
    { test: 'test' }
];

const test = (fn: Function, ...trueIndexes: Array<number>): void => {
    values.forEach((value, i) => {
        const result = trueIndexes.includes(i) ? true : false;
        expect(fn(value)).toBe(result);
    });
};

describe('Helpers', () => {
    describe('Type check', () => {
        it('should return true for string and false otherwise', () => {
            test(isString, 3, 4, 8);
        });

        it('should return true for number and false otherwise', () => {
            test(isNumber, 2);
        });

        it('should return true for boolean and false otherwise', () => {
            test(isBoolean, 5, 6);
        });

        it('should return true for object and false otherwise', () => {
            test(isObject, 7, 11, 12);
        });

        it('should return true for array and false otherwise', () => {
            test(isArray, 9, 10);
        });

        it('should return true for date object and false otherwise', () => {
            test(isDateObject, 7);
        });

        it('should return true for date value and false otherwise', () => {
            test(isDateValue, 2, 3, 8);
        });

        it('should return true for nullish and false otherwise', () => {
            test(isNullish, 0, 1);
        });
    });

    describe('tryParse', () => {
        it('should return parsed json for object string', () => {
            // no need to test undefined value because JSON does not support it
            const obj = {
                test: 'test',
                value: 4,
                array: ['4', 4, false],
                bool: false,
                subObj: { test: 'test' },
                date: new Date().toISOString(),
                n: null
            };

            const string = JSON.stringify(obj);
            const parsed = tryParse(string);
            expect(parsed).toStrictEqual(obj);
        });

        it('should return the given value', () => {
            values.slice(1).forEach(value => {
                expect(tryParse(value)).toStrictEqual(value);
            });
        });
    });

    describe('difference', () => {
        it('should return empty array for two empty arrays', () => {
            const diff = difference([], []);
            expect(diff).toStrictEqual([]);
        });

        it('should return one element if the first array contains one and the other is empty', () => {
            const diff = difference(['test'], []);
            expect(diff).toStrictEqual(['test']);
        });

        it('should return empty array if the first array is empty and the second contains one', () => {
            const diff = difference([], ['test']);
            expect(diff).toStrictEqual([]);
        });

        it('should return two elements', () => {
            const diff = difference(['test2', 'test', 'test3'], ['test']);
            expect(diff).toStrictEqual(['test2', 'test3']);
        });
    });
});
