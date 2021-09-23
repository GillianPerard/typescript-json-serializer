export type ErrorCallback = (message: string) => void;
export type FormatPropertyNameProto = (propertyName: string) => string;
export type Policy = 'allow' | 'disallow' | 'remove';

export class JsonSerializerOptions {
    errorCallback?: ErrorCallback = logError;
    nullishPolicy: NullishPolicy = {
        undefined: 'remove',
        null: 'allow'
    };
    formatPropertyName?: FormatPropertyNameProto;
}

export interface NullishPolicy {
    undefined: Policy;
    null: Policy;
}

export const throwError = (message: string) => {
    throw new Error(message);
};

export const logError = (message: string) => {
    console.error(message);
};
