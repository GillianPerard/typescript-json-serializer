import { Serializable, JsonProperty } from '../../src';

@Serializable()
export class PhoneNumber {
    constructor(
        @JsonProperty()
        public countryCode: string,
        @JsonProperty()
        public phoneNumber: string
    ) {}
}
