import { JsonProperty, JsonObject } from '../../src';

@JsonObject()
export class PhoneNumber {
    @JsonProperty() countryCode: string;
    @JsonProperty() value: string | undefined;

    constructor(phoneNumber?: string) {
        this.value = phoneNumber;
    }
}
