// tslint:disable: ban-types
// tslint:disable: variable-name

import 'reflect-metadata'

import Metadata from './metadata'
import Type from './type'

const apiMap: string = 'api:map:'
const apiMapSerializable: string = `${apiMap}serializable`
const designType: string = 'design:type'
const designParamtypes: string = 'design:paramtypes'

/**
 * Generator function to find the name of function parameters
 */
function* getParamNames(ctor: object): IterableIterator<string> {
  const comments_removed: string = ctor
    .toString()
    .replace(/(\/\*[\s\S]*?\*\/|\/\/.*$)/gm, '')
  const parameter_pattern: RegExp = /(?:this.)([^\s=;]+)\s*=/gm
  let match: RegExpExecArray | null

  // tslint:disable-next-line:no-conditional-assignment
  while ((match = parameter_pattern.exec(comments_removed))) {
    const parameter_name: string = match[1]
    if (parameter_name) {
      yield parameter_name
    }
  }

  return
}

/**
 * Decorator JsonProperty
 */
export function JsonProperty(
  args?:
    | string
    | { name?: string; type: Function }
    | { name?: string; predicate: Function },
): Function {
  return (target: Object | Function, key: string, index: number): void => {
    const prototype = (target as Function).prototype
    if (key === undefined && prototype) {
      const type: Function = Reflect.getMetadata(designParamtypes, target, key)[
        index
      ]
      const keys: string[] = Array.from(getParamNames(prototype.constructor))
      key = keys[index]
      target = prototype
      Reflect.defineMetadata(designType, type, target, key)
    }
    let map: { [id: string]: Metadata } = {}
    const targetName: string = target.constructor.name
    const apiMapTargetName: string = `${apiMap}${targetName}`

    if (Reflect.hasMetadata(apiMapTargetName, target)) {
      map = Reflect.getMetadata(apiMapTargetName, target)
    }

    map[key] = getJsonPropertyValue(key, args)
    Reflect.defineMetadata(apiMapTargetName, map, target)
  }
}

/**
 * Decorator Serializable
 */
export function Serializable(baseClassName?: string): Function {
  return (target: Object): void => {
    Reflect.defineMetadata(apiMapSerializable, baseClassName, target)
  }
}

/**
 * Function to deserialize json into a class
 */
export function deserialize(json: any, type: any): any {
  const instance: any = new type()
  const instanceName: string = instance.constructor.name
  const baseClassName: string = Reflect.getMetadata(apiMapSerializable, type)
  const apiMapInstanceName: string = `${apiMap}${instanceName}`
  const hasMap: boolean = Reflect.hasMetadata(apiMapInstanceName, instance)
  let instanceMap: { [id: string]: Metadata } = {}

  if (!hasMap) {
    return instance
  }

  instanceMap = Reflect.getMetadata(apiMapInstanceName, instance)

  if (baseClassName) {
    const baseClassMap: { [id: string]: Metadata } = Reflect.getMetadata(
      `${apiMap}${baseClassName}`,
      instance,
    )
    instanceMap = { ...instanceMap, ...baseClassMap }
  }

  const keys: string[] = Object.keys(instanceMap)
  keys.forEach((key: string) => {
    if (json[instanceMap[key].name] !== undefined) {
      instance[key] = convertDataToProperty(
        instance,
        key,
        instanceMap[key],
        json[instanceMap[key].name],
      )
    }
  })

  return instance
}

/**
 * Function to serialize a class into json
 */
export function serialize(instance: any, removeUndefined: boolean = true): any {
  const json: any = {}
  const instanceName: string = instance.constructor.name
  const baseClassName: string = Reflect.getMetadata(
    apiMapSerializable,
    instance.constructor,
  )
  const apiMapInstanceName: string = `${apiMap}${instanceName}`
  const hasMap: boolean = Reflect.hasMetadata(apiMapInstanceName, instance)
  let instanceMap: { [id: string]: Metadata } = {}

  if (!hasMap) {
    return json
  }

  instanceMap = Reflect.getMetadata(apiMapInstanceName, instance)

  if (baseClassName !== undefined) {
    const baseClassMap: { [id: string]: any } = Reflect.getMetadata(
      `${apiMap}${baseClassName}`,
      instance,
    )
    instanceMap = { ...instanceMap, ...baseClassMap }
  }

  const instanceKeys: string[] = Object.keys(instance)
  Object.keys(instanceMap).forEach((key: string) => {
    if (!instanceKeys.includes(key)) {
      return
    }
    const data: any = convertPropertyToData(
      instance,
      key,
      instanceMap[key],
      removeUndefined,
    )
    if (!removeUndefined || (removeUndefined && data !== undefined)) {
      json[instanceMap[key].name] = data
    }
  })

  return json
}

/**
 * Function to convert json data to the class property
 */
function convertPropertyToData(
  instance: any,
  key: string,
  value: Metadata,
  removeUndefined: boolean,
): any {
  const property: any = instance[key]
  const type: Metadata = Reflect.getMetadata(designType, instance, key)
  const isArray: boolean = type.name.toLocaleLowerCase() === Type.Array
  const predicate: Function = (value as { predicate: Function }).predicate
  const propertyType: any = (value as { type: Function }).type || type
  const isSerializableProperty: boolean = isSerializable(propertyType)

  if (isSerializableProperty || predicate) {
    if (isArray) {
      const array: any[] = []
      property.forEach((d: any) => {
        array.push(serialize(d, removeUndefined))
      })

      return array
    }

    return serialize(property, removeUndefined)
  }

  if (propertyType.name.toLocaleLowerCase() === Type.Date) {
    return property.toISOString()
  }

  return property
}

/**
 * Function to convert json data to the class property
 */
function convertDataToProperty(
  instance: Function,
  key: string,
  value: Metadata,
  data: any,
): any {
  const type: Metadata = Reflect.getMetadata(designType, instance, key)
  const isArray: boolean = type.name.toLowerCase() === Type.Array
  const predicate: Function = (value as { predicate: Function }).predicate
  let propertyType: any = (value as { type: Function }).type || type
  const isSerializableProperty: boolean = isSerializable(propertyType)

  if (!isSerializableProperty && !predicate) {
    return castSimpleData(propertyType.name, data)
  }

  if (isArray) {
    const array: any[] = []
    data.forEach((d: any) => {
      if (predicate) {
        propertyType = predicate(d)
      }
      array.push(deserialize(d, propertyType))
    })

    return array
  }

  propertyType = predicate ? predicate(data) : propertyType
  return deserialize(data, propertyType)
}

/**
 * Function to test if a class has the serializable decorator (metadata)
 */
function isSerializable(type: any): boolean {
  return Reflect.hasOwnMetadata(apiMapSerializable, type)
}

/**
 * Function to transform the JsonProperty value into an object like {name: string, type: Function}
 */
function getJsonPropertyValue(
  key: string,
  args?:
    | string
    | { name?: string; type: Function }
    | { name?: string; predicate: Function },
): Metadata {
  if (!args) {
    return {
      name: key.toString(),
      type: undefined!,
    }
  }
  const name: string =
    typeof args === Type.String
      ? (args as string)
      : (args as { name: string }).name
      ? (args as { name: string }).name
      : key.toString()
  return (args as { predicate: Function }).predicate
    ? { name, predicate: (args as { predicate: Function }).predicate }
    : { name, type: (args as { type: Function }).type }
}

/**
 * Function to cast simple type data into the real class property type
 */
function castSimpleData(type: string, data: any): any {
  type = type.toLowerCase()

  if ((typeof data).toLowerCase() === type) {
    return data
  }

  switch (type) {
    case Type.String:
      return data.toString()
    case Type.Number:
      // tslint:disable-next-line: variable-name
      const number: number = +data
      if (isNaN(number)) {
        // tslint:disable-next-line: no-console
        console.error(
          `${data}: Type ${typeof data} is not assignable to type ${type}.`,
        )
        return undefined
      }
      return number
    case Type.Boolean:
      // tslint:disable-next-line: no-console
      console.error(
        `${data}: Type ${typeof data} is not assignable to type ${type}.`,
      )
      return undefined
    case Type.Date:
      if (isNaN(Date.parse(data))) {
        // tslint:disable-next-line: no-console
        console.error(
          `${data}: Type ${typeof data} is not assignable to type ${type}.`,
        )
        return undefined
      }
      return new Date(data)
    default:
      return data
  }
}
