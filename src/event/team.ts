import { EventBase } from "@gameye/statistic-common";
import { PlayerWithoutTeamModel } from ".";

export interface TeamPlayingPayload {
    team: string;
    clantag: string;
}
export type TeamPlayingEvent = EventBase<"team-playing", TeamPlayingPayload>;

export interface TeamScorePayload {
    team: string;
    score: number;
    players: number;
}
export type TeamScoreEvent = EventBase<"team-score", TeamScorePayload>;

export interface PlayerSwitchedTeamPayload {
    player: PlayerWithoutTeamModel;
    oldTeam: string;
    newTeam: string;

}
export type PlayerSwitchedTeamEvent = EventBase<"player-switched-team", PlayerSwitchedTeamPayload>;
