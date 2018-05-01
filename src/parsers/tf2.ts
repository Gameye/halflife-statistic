// tslint:disable:max-line-length

import { EventBase } from "@gameye/statistic-common";
import * as event from "../event";
import { HalflifeLogParserBase } from "./halflife";

// TODO: should we refactor to  a HalfLiveLogEvents type ??

export type Tf2LogEvents = // assume we share events with CsGo ...
    // event.GameCommencingEvent |
    event.GameOverEvent |
    event.MatchStartEvent |
    event.RoundStartEvent |
    // event.MiniRoundStartEvent |
    event.RoundEndEvent |
    // event.MiniRoundEndEvent |
    event.PlayerConnectedEvent |
    event.PlayerDisconnectedEvent |
    event.PlayerAssistedEvent |
    event.PlayerKilledEvent |
    event.PlayerSuicideEvent |
    event.PlayerSwitchedTeamEvent |
    event.TeamPlayingEvent |
    event.TeamScoreEvent |
    event.NumberParameterValueEvent;

export class Tf2LogParser extends HalflifeLogParserBase<Tf2LogEvents> {

    constructor() {
        super();
        // L 04/16/2018 - 10:43:22: World triggered "Round_Start"
        this.registerHalflifeParser(
            /^World\s+triggered\s+"Round_start"$/i,
            halflifeLine => ({
                type: "round-start",
                payload: {
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

        // L 04/16/2018 - 10:42:17: "Smashmint<3><[U:1:49496129]><>" connected, address "172.17.0.1:59541"
        this.registerHalflifeParser(
            /^(".*?")\s+connected,\s+address\s+"(.*)"$/i,
            (halflifeLine, playerString, address) => ({
                type: "player-connected",
                payload: {
                    player: this.parsePlayerWithTeam(playerString),
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

        // "Adam<4><BOT><TERRORIST>" disconnected (reason "Kicked by Console")
        this.registerHalflifeParser(
            /^(".*?")\s+disconnected$/i,
            (halflifeLine, playerString) => ({
                type: "player-disconnected",
                payload: {
                    player: this.parsePlayerWithTeam(playerString),
                    reason: halflifeLine.argMap.reason,
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

        // this.registerHalflifeParser(
        //     /^World\s+triggered\s+"Mini_Round_Selected"\s+\(round\s+"(.+?)"\)$/i,
        //     (halflifeLine, roundId) => ({
        //         type: "mini-round-start",
        //         payload: {
        //             timestamp: halflifeLine.timestamp,
        //             round: roundId,
        //         },
        //     }),
        // );

        // this.registerHalflifeParser(
        //     /^World\s+triggered\s+"Mini_Round_start"$/i,
        //     halflifeLine => ({
        //         type: "mini-round-start",
        //         payload: {
        //             timestamp: halflifeLine.timestamp,
        //             round: "test",
        //         },
        //     }),
        // );

        // L 04/16/2018 - 10:52:26: World triggered "Mini_Round_Win" (winner "Blue")
        // this.registerHalflifeParser(
        //     /^World\s+triggered\s+"Mini_Round_Win"\s+\(winner "(.+?)"\)\s+\(round "(.+?)"\)$/i,
        //     (halflifeLine, winnerId, roundId) => ({
        //         type: "mini-round-end",
        //         payload: {
        //             timestamp: halflifeLine.timestamp,
        //             round: roundId,
        //             winner: winnerId,
        //         },
        //     }),
        // );

        this.registerHalflifeParser(
            /^World\s+triggered\s+"Round_Win"$/i,
            halflifeLine => ({
                type: "round-end",
                payload: {
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

        // L 04/16/2018 - 11:10:21: World triggered "Game_Over" reason "Reached Round Limit"
        this.registerHalflifeParser(
            /^World\s+triggered\s+"Game_Over" reason "Reached Round Limit"$/i,
            halflifeLine => ({
                type: "game-over",
                payload: {
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );
    }

}
