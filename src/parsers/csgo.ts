// tslint:disable:max-line-length

import { EventBase } from "@gameye/statistic-common";
import * as event from "../event";
import { HalflifeLogParserBase } from "./halflife";

export type CsGoLogEvents =
    event.GameCommencingEvent |
    event.GameOverEvent |
    event.MatchStartEvent |
    event.RoundStartEvent |
    event.RoundEndEvent |
    event.PlayerConnectedEvent |
    event.PlayerDisconnectedEvent |
    event.PlayerAssistedEvent |
    event.PlayerKilledEvent |
    event.PlayerSuicideEvent |
    event.PlayerSwitchedTeamEvent |
    event.TeamPlayingEvent |
    event.TeamScoreEvent |
    event.NumberParameterValueEvent;

export class CsGoLogParser extends HalflifeLogParserBase<CsGoLogEvents> {

    constructor() {
        super();

        //#region rules

        this.registerRegexParser(
            /^(mp_[a-z_]+)\s+(\d+)/i,
            (line, name, value) => ({
                type: "number-parameter-value",
                payload: {
                    name, value: Number(value),
                },
            }),
        );

        this.registerRegexParser(
            /^(mp_[a-z_]+)\s+"(\d+)"/i,
            (line, name, value) => ({
                type: "number-parameter-value",
                payload: {
                    name, value: Number(value),
                },
            }),
        );

        this.registerHalflifeParser(
            /^World\s+triggered\s+"Game_Commencing"$/i,
            halflifeLine => ({
                type: "game-commencing",
                payload: {
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

        // Game Over: casual mg_active de_dust2 score 16:7 after 15 min
        this.registerHalflifeParser(
            /^Game\s+Over:\s+(.+)\s+(.+)\s+score\s+(\d+):(\d+)\s+after\s+(\d+)\s+min$/i,
            halflifeLine => ({
                type: "game-over",
                payload: {
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

        // World triggered "Match_Start" on "de_dust2"
        this.registerHalflifeParser(
            /^World\s+triggered\s+"Match_Start"\s+on\s+"(.+)"/i,
            halflifeLine => ({
                type: "match-start",
                payload: {
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

        // World triggered "Round_Start"
        this.registerHalflifeParser(
            /^World\s+triggered\s+"Round_start"$/i,
            halflifeLine => ({
                type: "round-start",
                payload: {
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

        // World triggered "Round_End"
        this.registerHalflifeParser(
            /^World\s+triggered\s+"Round_End"$/i,
            halflifeLine => ({
                type: "round-end",
                payload: {
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

        // "Micrux ¬ GAMEYE<3><STEAM_1:0:31398789><>" connected, address ""
        this.registerHalflifeParser(
            /^(".*?(?:\<.*?\>){3}")\s+connected,\s+address\s+"(.*)"$/i,
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
            /^(".*?(?:\<.*?\>){3}")\s+disconnected$/i,
            (halflifeLine, playerString) => ({
                type: "player-disconnected",
                payload: {
                    player: this.parsePlayerWithTeam(playerString),
                    reason: halflifeLine.argMap.reason,
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

        // "Smashmint<13><STEAM_1:1:24748064><CT>" assisted killing "Micrux ¬ GAMEYE<3><STEAM_1:0:31398789><TERRORIST>"
        this.registerHalflifeParser(
            /^(".*?(?:\<.*?\>){3}")\s+assisted\s+killing\s+(".*?(?:\<.*?\>){3}")/i,
            (halflifeLine, assisterPlayerString, victimPlayerString) => ({
                type: "player-assisted",
                payload: {
                    assister: this.parsePlayerWithTeam(assisterPlayerString),
                    victim: this.parsePlayerWithTeam(victimPlayerString),
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

        // "Lau<2><STEAM_1:0:16690820><TERRORIST>" [-478 310 4] killed "Micrux ¬ GAMEYE<3><STEAM_1:0:31398789><CT>" [-383 1079 -6] with "p250"
        this.registerHalflifeParser(
            /^(".*?(?:\<.*?\>){3}")\s+\[.*\]\s+killed\s+(".*?(?:\<.*?\>){3}")/i,
            (halflifeLine, killerPlayerString, victimPlayerString) => ({
                type: "player-killed",
                payload: {
                    killer: this.parsePlayerWithTeam(killerPlayerString),
                    victim: this.parsePlayerWithTeam(victimPlayerString),
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

        // "Lau<2><STEAM_1:0:16690820><TERRORIST>" [-1015 -808 194] committed suicide with "world"
        this.registerHalflifeParser(
            /^(".*?(?:\<.*?\>){3}")\s+(\[.*?\])\s+committed\s+suicide\s+with\s+"(.*?)"/i,
            (halflifeLine, playerString, locationString, cause) => ({
                type: "player-suicide",
                payload: {
                    player: this.parsePlayerWithTeam(playerString),
                    playerPosition: this.parseArray(locationString).map(Number) as event.PositionModel,
                    cause,
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

        // "Adam<4><BOT>" switched from team <Unassigned> to <TERRORIST>
        this.registerHalflifeParser(
            /^(".*?(?:\<.*?\>){2}")\s+switched\s+from\s+team\s+\<(.*?)\>\s+to\s+\<(.*?)\>$/i,
            (halflifeLine, playerString, oldTeam, newTeam) => ({
                type: "player-switched-team",
                payload: {
                    player: this.parsePlayerWithoutTeam(playerString),
                    oldTeam,
                    newTeam,
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

        // Team playing "TERRORIST": Gameye
        this.registerHalflifeParser(
            /^Team\s+playing\s+"(.*?)":\s+(.*?)$/i,
            (halflifeLine, team, clantag) => ({
                type: "team-playing",
                payload: {
                    team,
                    clantag,
                    timestamp: halflifeLine.timestamp,
                },
            }),
        );

        // Team "TERRORIST" scored "7" with "1" players
        this.registerHalflifeParser(
            /^Team\s+"(\w*)"\s+scored\s+"(\d+)"\s+with\s+"(\d+)"\s+players/i,
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

        //#endregion
    }

    // [-383 1079 -6]
    // [ weapon_knife_t weapon_p250 weapon_c4 C4 ]
    protected parseArray(arrayString: string): string[] {
        const match = /^\[\s*(.*?)\s*\]$/i.exec(arrayString);
        if (match === null) throw new Error(`${arrayString} is not a valid array string (did you include the []'s?)`);

        const [, innerArrayString] = match;
        return innerArrayString.split(/\s+/);
    }

    // "Micrux ¬ GAMEYE<3><STEAM_1:0:31398789>"
    // "Smashmint""<2><STEAM_1:1:24s748064>"
    // "Smashmint<><12><STEAM_1:1:24748064>"
    protected parsePlayerWithoutTeam(playerString: string): event.PlayerWithoutTeamModel {
        const match = /^"(.*)\<(.*?)\>\<(.*?)\>"$/i.exec(playerString);
        if (match === null) throw new Error(`${playerString} is not a valid player string (did you include the "'s?)`);

        const [, name, key, uid] = match;
        return {
            name, key, uid,
        };
    }
}
