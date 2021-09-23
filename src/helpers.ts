import { PredicateProto } from './json-property';
import { Reflection } from './reflection';

export const isString = (value: unknown): value is string => typeof value === 'string';
export const isNumber = (value: any): value is number => typeof value === 'number';
export const isBoolean = (value: any): value is number => typeof value === 'boolean';
export const isObject = (value: unknown): value is object =>
    value !== null && typeof value === 'object' && !isArray(value);
export const isArray = (value: unknown): value is Array<any> => Array.isArray(value);
export const isDateObject = (value: any): value is Date => toString.call(value) === '[object Date]';
export const isDateValue = (value: any): value is string | number => {
    if (isDateObject(value) || isArray(value)) {
        return false;
    }

    return !isNaN(Date.parse(value));
};
export const isNullish = (value: any): value is null | undefined =>
    [null, undefined].includes(value);
export const isJsonObject = (propertyType: any) => Reflection.isJsonObject(propertyType);

export const isPredicate = (value: any): value is PredicateProto => {
    if (!value) {
        return false;
    }

    const paramTypes = Reflection.getParamTypes(value);
    const valueLength = value.length;

    return (valueLength === 1 || valueLength === 2) && !paramTypes;
};

export const tryParse = (value: any) => {
    try {
        const parsed = JSON.parse(value);
        return typeof parsed === 'object' ? parsed : value;
    } catch {
        return value;
    }
};
