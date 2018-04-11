import { EventBase } from "@gameye/statistic-common";
import { TimestampPayload } from ".";

export type MatchStartEvent = EventBase<"match-start", TimestampPayload>;
export type MatchEndEvent = EventBase<"match-end", TimestampPayload>;

export type GameCommencingEvent = EventBase<"game-commencing", TimestampPayload>;
export type GameOverEvent = EventBase<"game-over", TimestampPayload>;
