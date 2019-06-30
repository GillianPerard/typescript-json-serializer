// tslint:disable: no-console

import deepEqual = require('deep-equal')
import { Student } from './models'
import { serialize } from './serializer'
import { deserialize } from './serializer'

const original = new Student(1, 'student-1', true, [
  new Student(2, 'student-2', true),
  new Student(3, 'student-3', true),
])
console.log(original)

const serialized = serialize(original)
console.log(serialized)

const deserialized = deserialize(serialized, Student) as Student
console.log(deserialized)

const identical = deepEqual(original, deserialized)

if (identical) {
  window.alert('It works.')
} else {
  window.alert('It does not work.')
}
