import { EventBase } from "@gameye/statistic-common";

export type PlayerConnectedEvent = EventBase<"player-connected", undefined>;
export type PlayerDisconnectedEvent = EventBase<"player-disconnected", undefined>;

export type PlayerSuicideEvent = EventBase<"player-suicide", undefined>;
export type PlayerKilledEvent = EventBase<"player-killed", undefined>;
export type PlayerAssistedEvent = EventBase<"player-assisted", undefined>;

export type PlayerSwitchedTeamEvent = EventBase<"player-switched-team", undefined>;
