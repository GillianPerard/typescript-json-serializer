// eslint-disable-next-line max-classes-per-file
import { JsonObject, JsonProperty, JsonSerializer } from '../src';

@JsonObject({ autoPredicate: true })
abstract class Base {
    @JsonProperty() property0: string;
}

@JsonObject()
class ChildA extends Base {
    @JsonProperty() property1: string;
}

@JsonObject()
class ChildB extends Base {
    @JsonProperty() property2: string;
}

@JsonObject()
class Outer {
    @JsonProperty()
    property: Base;
}

@JsonObject()
class OuterArray {
    @JsonProperty({ type: Base })
    property: Array<Base>;
}

describe('auto-predicate', () => {
    it('serialize and deserialize', () => {
        const jsonSerializer = new JsonSerializer();
        const childA = new ChildA();
        childA.property0 = 'property0';
        childA.property1 = 'property1';
        const childB = new ChildB();
        childB.property0 = 'property0';
        childB.property2 = 'property2';

        const outer = new Outer();
        outer.property = childA;

        const json = jsonSerializer.serialize(outer);
        expect(json).toEqual({
            property: {
                __class__: 'ChildA',
                property0: 'property0',
                property1: 'property1'
            }
        });

        if (json) {
            const deserialized = jsonSerializer.deserialize(json, Outer);
            expect(deserialized).toEqual(outer);
        }

        const outer2 = new Outer();
        outer2.property = childB;
        const json2 = jsonSerializer.serialize(outer2);
        expect(json2).toEqual({
            property: {
                __class__: 'ChildB',
                property0: 'property0',
                property2: 'property2'
            }
        });

        if (json2) {
            const deserialized2 = jsonSerializer.deserialize(json2, Outer);
            expect(deserialized2).toEqual(outer2);
        }
    });
});

describe('child-class-array', () => {
    it('should serialize', () => {
        const jsonSerializer = new JsonSerializer();
        const childA = new ChildA();
        childA.property0 = 'property0';
        childA.property1 = 'property1';
        const childB = new ChildB();
        childB.property0 = 'property0';
        childB.property2 = 'property2';

        const outerArray = new OuterArray();
        outerArray.property = [childA, childB];

        const json = jsonSerializer.serialize(outerArray);

        expect(json).toEqual({
            property: [
                {
                    __class__: 'ChildA',
                    property0: 'property0',
                    property1: 'property1'
                },
                {
                    __class__: 'ChildB',
                    property0: 'property0',
                    property2: 'property2'
                }
            ]
        });

        if (json) {
            const deserialized = jsonSerializer.deserialize(json, OuterArray);
            expect(deserialized).toEqual(outerArray);
        }
    });
});
