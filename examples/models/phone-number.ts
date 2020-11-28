import { JsonProperty, Serializable } from '../../src';

@Serializable()
export class PhoneNumber {
    @JsonProperty() countryCode: string;
    @JsonProperty() value: string | undefined;

    constructor(phoneNumber?: string) {
        this.value = phoneNumber;
    }
}
