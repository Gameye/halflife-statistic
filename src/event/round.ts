import { EventBase } from "@gameye/statistic-common";
import { TimestampPayload } from ".";

export type RoundStartEvent = EventBase<"round-start", TimestampPayload>;
export type RoundEndEvent = EventBase<"round-end", TimestampPayload>;
