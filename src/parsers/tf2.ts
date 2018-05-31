// tslint:disable:max-line-length

import { EventBase } from "@gameye/statistic-common";
import * as event from "../event";
import { HalflifeLogParserBase } from "./halflife";

// TODO: should we refactor to  a HalfLiveLogEvents type ??

export type Tf2LogEvents = // assume we share events with CsGo ...
    event.GameOverEvent |
    event.MatchStartEvent |
    event.RoundStartEvent |
    event.RoundEndEvent |
    event.PlayerEnteredGameEvent |
    event.PlayerDisconnectedEvent |
    event.PlayerAssistedEvent |
    event.PlayerRevengeEvent |
    event.PlayerDestructionEvent |
    event.PlayerDominationEvent |
    event.PlayerDefenseEvent |
    event.PlayerUberchargeEvent |
    event.PlayerKilledEvent |
    event.PlayerSuicideEvent |
    event.PlayerSwitchedTeamEvent |
    event.PlayerJoinedTeamEvent |
    event.TeamPlayingEvent |
    event.TeamScoreEvent |
    event.TeamPointCapturedEvent |
    event.StringParameterValueEvent |
    event.NumberParameterValueEvent;

export class Tf2LogParser extends HalflifeLogParserBase<Tf2LogEvents> {

    constructor() {
        super();

        // Loading game mode payload
        // Loading game mode koth
        // Loading game mode cp
        // Loading game mode payloadrace
        this.registerRegexParser(
            /^Loading game mode\s+(\w+)/i,
            (line, gameMode) => ({
                type: "string-parameter-value",
                payload: {
                    name: "gameMode",
                    value: gameMode,
                },
            }),
        );
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

        // L 05/16/2018 - 08:36:48: "super cool superhero<6><[U:1:238303253]><>" entered the game
        this.registerHalflifeParser(
            /^(".*?")\s+entered\s+the\s+game$/i,
            (halflifeLine, playerString, address) => ({
                type: "player-entered-game",
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
                type: "player-joined-team",
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

        // L 04/16/2018 - 14:31:27: "Micrux ¬ GAMEYE<4><[U:1:62797578]><Red>" triggered "revenge" against "Smashmint<3><[U:1:49496129]><Blue>"
        this.registerHalflifeParser(
            /^(".*?")\s+triggered\s+"revenge"\s+against\s+(".*?")/i,
            (halflifeLine, revengePlayerString, victimPlayerString) => ({
                type: "player-revenged",
                payload: {
                    player: this.parsePlayerWithTeam(revengePlayerString),
                    victim: this.parsePlayerWithTeam(victimPlayerString),
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

        // L 04/16/2018 - 14:30:51: "Smashmint<3><[U:1:49496129]><Blue>" triggered "domination" against "Micrux ¬ GAMEYE<4><[U:1:62797578]><Red>"
        this.registerHalflifeParser(
            /^(".*?")\s+triggered\s+"domination"\s+against\s+(".*?")/i,
            (halflifeLine, dominatingPlayerString, victimPlayerString) => ({
                type: "player-dominated",
                payload: {
                    player: this.parsePlayerWithTeam(dominatingPlayerString),
                    victim: this.parsePlayerWithTeam(victimPlayerString),
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );
        // L 04/16/2018 - 14:40:08: "Smashmint<3><[U:1:49496129]><Red>" triggered "captureblocked" (cp "0") (cpname "#Badwater_cap_1") (position "-1182 -1570 0")
        this.registerHalflifeParser(
            /^(".*?")\s+triggered\s+"captureblocked"/i,
            (halflifeLine, playerString) => ({
                type: "player-defensed",
                payload: {
                    player: this.parsePlayerWithTeam(playerString),
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

        // L 04/16/2018 - 14:33:01: "Smashmint<3><[U:1:49496129]><Blue>" triggered "killedobject" (object "OBJ_DISPENSER") (weapon "back_scatter") (objectowner "Micrux ¬ GAMEYE<4><[U:1:62797578]><Red>") (attacker_position "-1011 -285 502")
        this.registerHalflifeParser(
            /^(".*?")\s+triggered\s+"killedobject"/i,
            (halflifeLine, playerString) => ({
                type: "player-destructed",
                payload: {
                    player: this.parsePlayerWithTeam(playerString),
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );
        // L 04/16/2018 - 14:43:17: "Micrux ¬ GAMEYE<4><[U:1:62797578]><Blue>" triggered "chargedeployed"
        this.registerHalflifeParser(
            /^(".*?")\s+triggered\s+"chargedeployed"/i,
            (halflifeLine, playerString) => ({
                type: "player-ubercharged",
                payload: {
                    player: this.parsePlayerWithTeam(playerString),
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

        // L 04/19/2018 - 12:38:53: Team "Red" current score "2" with "1" players
        this.registerHalflifeParser(
            /^Team\s+"(\w*)"\s+current score\s+"(\d+)"\s+with\s+"(\d+)"\s+players/i,
            (halflifeLine, team, scoreString, playerString) => ({
                type: "team-score",
                payload: {
                    team,
                    score: Number(scoreString),
                    players: Number(playerString),
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

        // L 04/16/2018 - 14:26:02: Team "Blue" triggered "pointcaptured" (cp "0") (cpname "#Badwater_cap_1") (numcappers "1") (player1 "Smashmint<3><[U:1:49496129]><Blue>") (position1 "1016 -1517 206")
        this.registerHalflifeParser(
            // /^Team\s+"(\w+?)"\s+triggered "pointcaptured" \(cp "(\d+)"\)/i,
            /^Team\s+"(\w+?)"\s+triggered "pointcaptured"/i,
            (halflifeLine, team) => ({
                type: "team-pointcaptured",
                payload: {
                    team,
                    pointIndex: Number(halflifeLine.argMap.cp),
                    numcappers: Number(halflifeLine.argMap.numcappers),
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );
    }

}
