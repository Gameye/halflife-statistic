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

        // L 04/16/2018 - 10:52:36: "Smashmint<3><[U:1:49496129]><Blue>" joined team "Red"
        this.registerHalflifeParser(
            /^(".*?")\s+joined\s+team\s+"(.*?)"$/i,
            (halflifeLine, playerString, newTeam) => ({
                type: "player-switched-team",
                payload: {
                    player: this.parsePlayerWithTeam(playerString),
                    oldTeam: "player_team",
                    newTeam,
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );
        // L 04/19/2018 - 12:26:38: "Smashmint<4><[U:1:49496129]><Red>" triggered "kill assist" against "elmerbulthuis<8><[U:1:426663176]><Blue>" (assister_position "1016 1014 297") (attacker_position "1161 1212 271") (victim_position "1287 1120 258")
        this.registerHalflifeParser(
            /^(".*?")\s+triggered\s+"kill assist"\s+against\s+(".*?")/i,
            (halflifeLine, assisterPlayerString, victimPlayerString) => ({
                type: "player-assisted",
                payload: {
                    assister: this.parsePlayerWithTeam(assisterPlayerString),
                    victim: this.parsePlayerWithTeam(victimPlayerString),
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

        // L 04/19/2018 - 12:09:37: "Smashmint<4><[U:1:49496129]><Red>" killed "denise<3><[U:1:437819661]><Blue>" with "loch_n_load" (attacker_position "-806 -419 559") (victim_position "-1215 321 508")
        // L 04/17/2018 - 14:37:58: "Smashmint<3><[U:1:49496129]><Blue>" killed "Micrux ¬ GAMEYE<4><[U:1:62797578]><Red>" with "eternal_reward" (customkill "backstab") (attacker_position "-530 -92 296") (victim_position "-474 -92 296")
        // L 04 / 19 / 2018 - 15: 17: 21: "Smashmint<3><[U:1:49496129]><Blue>" killed "denise<4><[U:1:437819661]><Red>" with "the_classic"(customkill "headshot")(attacker_position "-1432 737 -141")(victim_position "-1517 46 -376")
        this.registerHalflifeParser(
            /^(".*?")\s+killed\s+(".*?")\s+with\s+"(.*?)"/i,
            (halflifeLine, killerPlayerString, victimPlayerString, weapon) => ({
                type: "player-killed",
                payload: {
                    killer: this.parsePlayerWithTeam(killerPlayerString),
                    victim: this.parsePlayerWithTeam(victimPlayerString),
                    timestamp: halflifeLine.timestamp,
                    weapon,
                    customkill: halflifeLine.argMap.customkill,
                },
            }),
        );

        // L 04/16/2018 - 10:49:33: "denise<4><[U:1:437819661]><Red>" committed suicide with "world" (attacker_position "611 -351 -127")
        this.registerHalflifeParser(
            /^(".*?")\s+committed suicide with\s+"(.*)"$/i,
            (halflifeLine, playerString, cause) => ({
                type: "player-suicide",
                payload: {
                    player: this.parsePlayerWithTeam(playerString),
                    playerPosition: halflifeLine.argMap.attacker_position.split(" ").map(Number) as event.PositionModel,
                    cause,
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

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
