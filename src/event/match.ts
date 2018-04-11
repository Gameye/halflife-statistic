import { EventBase } from "@gameye/statistic-common";

export type MatchStartEvent = EventBase<"match-start", undefined>;
export type MatchEndEvent = EventBase<"match-end", undefined>;

export type GameCommencingEvent = EventBase<"game-commencing", undefined>;
export type GameOverEvent = EventBase<"game-over", undefined>;
