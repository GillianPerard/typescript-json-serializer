import { Organization, Panther, Zoo } from '../examples';
import { JsonSerializer, throwError } from '../src';

describe('JsonSerializerOptions', () => {
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

    describe('NullishPolicy', () => {
        it('should remove null and undefined values on deserialize', () => {
            const jsonSerializer = new JsonSerializer({
                nullishPolicy: { null: 'remove', undefined: 'remove' }
            });

            const data = [
                {
                    Animals: [
                        {
                            id: null,
                            name: 'test',
                            color: undefined,
                            isSpeckled: false
                        },
                        null,
                        undefined
                    ],
                    name: undefined,
                    id: null
                },
                null,
                undefined
            ];

            const animal = new Panther('test', false);
            const zoo = new Zoo();
            zoo.animals = [animal];
            const expected: Array<Zoo> = [zoo];
            const test = jsonSerializer.deserializeObjectArray(data, Zoo);
            expect(test).toStrictEqual(expected);
        });

        it('should remove null and undefined values on serialize', () => {
            const jsonSerializer = new JsonSerializer({
                nullishPolicy: { null: 'remove', undefined: 'remove' }
            });

            const expected = [
                {
                    Animals: [
                        {
                            name: 'test',
                            isSpeckled: false
                        }
                    ]
                }
            ];

            const animal = new Panther('test', false) as any;
            animal.id = null;
            animal.color = undefined;
            const zoo = new Zoo();
            zoo.animals = [animal, null, undefined];
            const zoos: Array<any> = [zoo, null, undefined];
            const test = jsonSerializer.serializeObjectArray(zoos);
            expect(test).toStrictEqual(expected);
        });

        it('should remove only null values on deserialize', () => {
            const jsonSerializer = new JsonSerializer({
                nullishPolicy: { null: 'remove', undefined: 'allow' }
            });

            const data = [
                {
                    Animals: [
                        {
                            id: null,
                            name: 'test',
                            color: undefined,
                            isSpeckled: false
                        },
                        null,
                        undefined
                    ],
                    name: undefined,
                    id: null
                },
                null,
                undefined
            ];

            const animal = new Panther('test', false) as any;
            animal.birthDate = undefined;
            animal.childrenIds = undefined;
            animal.color = undefined;
            animal.gender = undefined;
            animal.numberOfPaws = undefined;
            animal.status = undefined;
            const zoo = new Zoo() as any;
            zoo.animals = [animal, undefined];
            zoo.boss = undefined;
            zoo.city = undefined;
            zoo.coordinates = undefined;
            zoo.country = undefined;
            zoo.description = undefined;
            zoo.employees = undefined;
            zoo.mascot = undefined;
            zoo.name = undefined;
            zoo.phoneBook = undefined;
            zoo.unknownAnimals = undefined;
            const expected: Array<any> = [zoo, undefined];
            const test = jsonSerializer.deserializeObjectArray(data, Zoo);
            expect(test).toStrictEqual(expected);
        });

        it('should remove only null values on serialize', () => {
            const jsonSerializer = new JsonSerializer({
                nullishPolicy: { null: 'remove', undefined: 'allow' }
            });

            const expected = [
                {
                    Animals: [
                        {
                            birthDate: undefined,
                            childrenIds: undefined,
                            color: undefined,
                            gender: undefined,
                            isSpeckled: false,
                            name: 'test',
                            numberOfPaws: undefined,
                            status: undefined
                        },
                        undefined
                    ],
                    boss: undefined,
                    city: undefined,
                    coordinates: undefined,
                    country: undefined,
                    description: undefined,
                    employees: undefined,
                    id: undefined,
                    mascot: undefined,
                    name: undefined,
                    phoneBook: undefined,
                    unknownAnimals: undefined
                },
                undefined
            ];

            const animal = new Panther('test', false) as any;
            animal.id = null;
            animal.color = undefined;
            const zoo = new Zoo();
            zoo.animals = [animal, null, undefined];
            const zoos: Array<any> = [zoo, null, undefined];
            const test = jsonSerializer.serializeObjectArray(zoos);
            expect(test).toStrictEqual(expected);
        });

        it('should remove only undefined values on deserialize', () => {
            const jsonSerializer = new JsonSerializer({
                nullishPolicy: { null: 'allow', undefined: 'remove' }
            });

            const data = [
                {
                    Animals: [
                        {
                            id: null,
                            name: 'test',
                            color: undefined,
                            isSpeckled: false
                        },
                        null,
                        undefined
                    ],
                    name: undefined,
                    id: null
                },
                null,
                undefined
            ];

            const animal = new Panther('test', false) as any;
            animal.id = null;
            const zoo = new Zoo() as any;
            zoo.id = null;
            zoo.animals = [animal, null];
            const expected: Array<any> = [zoo, null];
            const test = jsonSerializer.deserializeObjectArray(data, Zoo);
            expect(test).toStrictEqual(expected);
        });

        it('should remove only undefined values on serialize', () => {
            const jsonSerializer = new JsonSerializer({
                nullishPolicy: { null: 'allow', undefined: 'remove' }
            });

            const expected = [
                {
                    Animals: [
                        {
                            id: null,
                            name: 'test',
                            isSpeckled: false
                        },
                        null
                    ]
                },
                null
            ];

            const animal = new Panther('test', false) as any;
            animal.id = null;
            animal.color = undefined;
            const zoo = new Zoo();
            zoo.animals = [animal, null, undefined];
            const zoos: Array<any> = [zoo, null, undefined];
            const test = jsonSerializer.serializeObjectArray(zoos);
            expect(test).toStrictEqual(expected);
        });
    });
});
