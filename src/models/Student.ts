import { JsonProperty, Serializable } from '../serializer'

@Serializable()
export class Student {
  constructor(
    /**
     * Student's id
     */
    @JsonProperty()
    public readonly id: number,
    /**
     * Student's name
     */
    @JsonProperty()
    public readonly name: string,
    /**
     * is student active?
     */
    @JsonProperty()
    public readonly active: boolean = true,
    /**
     * friends of student
     */
    @JsonProperty({ type: Student })
    public readonly friends: Student[] = [],
  ) {}
}
