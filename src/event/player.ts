import { EventBase } from "@gameye/statistic-common";
import { PositionModel, TimestampPayload } from ".";

export interface PlayerWithTeamModel {
    key: string;
    uid: string;
    name: string;
    team: string;
}

export interface PlayerWithoutTeamModel {
    key: string;
    uid: string;
    name: string;
}

export interface PlayerSayPayload extends TimestampPayload {
    player: PlayerWithTeamModel;
    message: string;
}
export type PlayerSayEvent = EventBase<"player-say", PlayerSayPayload>;

export interface PlayerConnectedPayload extends TimestampPayload {
    player: PlayerWithTeamModel;
}
export type PlayerConnectedEvent = EventBase<"player-connected", PlayerConnectedPayload>;

export interface PlayerDisconnectedPayload extends TimestampPayload {
    player: PlayerWithTeamModel;
    reason: string;
}
export type PlayerDisconnectedEvent = EventBase<"player-disconnected", PlayerDisconnectedPayload>;

export interface PlayerEnteredGamePayload extends TimestampPayload {
    player: PlayerWithTeamModel;
}
export type PlayerEnteredGameEvent = EventBase<"player-entered-game", PlayerEnteredGamePayload>;

export interface PlayerSuicidePayload extends TimestampPayload {
    player: PlayerWithTeamModel;
    playerPosition: PositionModel;
    cause: string;
}
export type PlayerSuicideEvent = EventBase<"player-suicide", PlayerSuicidePayload>;

export interface PlayerKilledPayload extends TimestampPayload {
    killer: PlayerWithTeamModel;
    victim: PlayerWithTeamModel;
    weapon?: string;
    customkill?: string;
}
export type PlayerKilledEvent = EventBase<"player-killed", PlayerKilledPayload>;

export interface PlayerAssistedPayload extends TimestampPayload {
    assister: PlayerWithTeamModel;
    victim: PlayerWithTeamModel;
}
export type PlayerAssistedEvent = EventBase<"player-assisted", PlayerAssistedPayload>;

export interface PlayerRevengePayload extends TimestampPayload {
    player: PlayerWithTeamModel;
    victim: PlayerWithTeamModel;
}
export type PlayerRevengeEvent = EventBase<"player-revenged", PlayerRevengePayload>;

export interface PlayerDominationPayload extends TimestampPayload {
    player: PlayerWithTeamModel;
    victim: PlayerWithTeamModel;
}
export type PlayerDominationEvent = EventBase<"player-dominated", PlayerDominationPayload>;

export interface PlayerDefensePayload extends TimestampPayload {
    player: PlayerWithTeamModel;
}
export type PlayerDefenseEvent = EventBase<"player-defensed", PlayerDefensePayload>;

export interface PlayerDestructionPayload extends TimestampPayload {
    player: PlayerWithTeamModel;
}
export type PlayerDestructionEvent = EventBase<"player-destructed", PlayerDestructionPayload>;

export interface PlayerUberchargePayload extends TimestampPayload {
    player: PlayerWithTeamModel;
}
export type PlayerUberchargeEvent = EventBase<"player-ubercharged", PlayerUberchargePayload>;
