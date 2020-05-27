import { EventBase } from "@gameye/statistic-common";
import { PlayerWithoutTeamModel } from ".";

export type OkLetsPlayRoundEndScorePayload = {
    score: number;
    player: PlayerWithoutTeamModel;
};
export type OkLetsPlayRoundEndScoreEvent =
    EventBase<"okletsplay-round-end-score", OkLetsPlayRoundEndScorePayload>;
