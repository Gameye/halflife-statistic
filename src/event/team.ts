import { EventBase } from "@gameye/statistic-common";
import { PlayerWithoutTeamModel, TimestampPayload } from ".";

export interface TeamPlayingPayload extends TimestampPayload {
    team: string;
    clantag: string;
}
export type TeamPlayingEvent = EventBase<"team-playing", TeamPlayingPayload>;

export interface TeamScorePayload extends TimestampPayload {
    team: string;
    score: number;
    players: number;
}
export type TeamScoreEvent = EventBase<"team-score", TeamScorePayload>;

export interface PlayerSwitchedTeamPayload extends TimestampPayload {
    player: PlayerWithoutTeamModel;
    oldTeam: string;
    newTeam: string;

}
export type PlayerSwitchedTeamEvent = EventBase<"player-switched-team", PlayerSwitchedTeamPayload>;
