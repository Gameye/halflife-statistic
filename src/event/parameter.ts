import { EventBase } from "@gameye/statistic-common";

export interface NumberParameterValuePayload {
    name: string;
    value: number;
}
export type NumberParameterValueEvent = EventBase<"number-parameter-value", NumberParameterValuePayload>;
