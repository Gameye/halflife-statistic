import { EventBase } from "@gameye/statistic-common";
import { PositionModel } from ".";
import { TimestampPayload } from ".";

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

export interface PlayerConnectedPayload extends TimestampPayload {
    player: PlayerWithTeamModel;
}
export type PlayerConnectedEvent = EventBase<"player-connected", PlayerConnectedPayload>;

export interface PlayerDisconnectedPayload extends TimestampPayload {
    player: PlayerWithTeamModel;
    reason: string;
}
export type PlayerDisconnectedEvent = EventBase<"player-disconnected", PlayerDisconnectedPayload>;

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
    assister: PlayerWithTeamModel;
    victim: PlayerWithTeamModel;
}
export type PlayerRevengeEvent = EventBase<"player-revenged", PlayerRevengePayload>;

export interface PlayerDominationPayload extends TimestampPayload {
    assister: PlayerWithTeamModel;
    victim: PlayerWithTeamModel;
}
export type PlayerDominationEvent = EventBase<"player-dominated", PlayerDominationPayload>;
