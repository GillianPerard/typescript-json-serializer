// tslint:disable: ban-types
type Metadata =
  | { name: string; type: Function }
  | { name: string; predicate: Function }

export default Metadata