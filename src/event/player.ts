import { EventBase } from "@gameye/statistic-common";
import { PositionModel } from ".";

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

export interface PlayerConnectedPayload {
    player: PlayerWithTeamModel;
}
export type PlayerConnectedEvent = EventBase<"player-connected", PlayerConnectedPayload>;

export interface PlayerDisconnectedPayload {
    player: PlayerWithTeamModel;
    reason: string;
}
export type PlayerDisconnectedEvent = EventBase<"player-disconnected", PlayerDisconnectedPayload>;

export interface PlayerSuicidePayload {
    player: PlayerWithTeamModel;
    playerPosition: PositionModel;
    cause: string;
}
export type PlayerSuicideEvent = EventBase<"player-suicide", PlayerSuicidePayload>;

export interface PlayerKilledPayload {
    killer: PlayerWithTeamModel;
    victim: PlayerWithTeamModel;
}
export type PlayerKilledEvent = EventBase<"player-killed", PlayerKilledPayload>;

export interface PlayerAssistedPayload {
    assister: PlayerWithTeamModel;
    victim: PlayerWithTeamModel;
}
export type PlayerAssistedEvent = EventBase<"player-assisted", PlayerAssistedPayload>;
