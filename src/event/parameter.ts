import { EventBase } from "@gameye/statistic-common";

export interface NumberParameterValuePayload {
    name: string;
    value: number;
}
export type NumberParameterValueEvent = EventBase<"number-parameter-value", NumberParameterValuePayload>;

export interface StringParameterValuePayload {
    name: string;
    value: string;
}
export type StringParameterValueEvent = EventBase<"string-parameter-value", StringParameterValuePayload>;
