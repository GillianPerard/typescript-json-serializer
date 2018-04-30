import 'reflect-metadata';
/**
 * Decorator JsonProperty
 */
export declare function JsonProperty(args?: string | {
    name?: string;
    type: Function;
}): Function;
/**
 * Decorator Serializable
 */
export declare function Serializable(parentType?: string): Function;
/**
 * Function to deserialize json into a class
 */
export declare function deserialize(json: any, type: any): any;
/**
 * Function to serialize a class into json
 */
export declare function serialize(instance: any, removeUndefined?: boolean): any;
