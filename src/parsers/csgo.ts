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
    event.TeamScoreEvent;

export class CsGoLogParser extends HalflifeLogParserBase<CsGoLogEvents> {

    constructor() {
        super();

        //#region rules

        const { halflifeParserList } = this;

        // Game Over: casual mg_active de_dust2 score 16:7 after 15 min
        halflifeParserList.push({
            pattern: /^World\s+triggered\s+"Game_Commencing"$/i,
            parse: (halflifeLine) => ({
                type: "game-commencing",
                payload: undefined,
            }),
        });

        // Game Over: casual mg_active de_dust2 score 16:7 after 15 min
        halflifeParserList.push({
            pattern: /^Game\s+Over:\s+(.+)\s+(.+)\s+score\s+(\d+):(\d+)\s+after\s+(\d+)\s+min$/i,
            parse: (halflifeLine) => ({
                type: "game-over",
                payload: undefined,
            }),
        });

        // World triggered "Match_Start" on "de_dust2"
        halflifeParserList.push({
            pattern: /^World\s+triggered\s+"Match_Start"\s+on\s+"(.+)"/i,
            parse: (halflifeLine) => ({
                type: "match-start",
                payload: undefined,
            }),
        });

        // World triggered "Round_Start"
        halflifeParserList.push({
            pattern: /^World\s+triggered\s+"Round_start"$/i,
            parse: (halflifeLine) => ({
                type: "round-start",
                payload: undefined,
            }),
        });

        // World triggered "Round_End"
        halflifeParserList.push({
            pattern: /^World\s+triggered\s+"Round_End"$/i,
            parse: (halflifeLine) => ({
                type: "round-end",
                payload: undefined,
            }),
        });

        // "Micrux ¬ GAMEYE<3><STEAM_1:0:31398789><>" connected, address ""
        halflifeParserList.push({
            pattern: /^(".*?")\s+connected,\s+address\s+"(.*)"$/i,
            parse: (halflifeLine, playerString, address) => ({
                type: "player-connected",
                payload: {
                    player: this.parsePlayerWithTeam(playerString),
                },
            }),
        });

        // "Adam<4><BOT><TERRORIST>" disconnected (reason "Kicked by Console")
        halflifeParserList.push({
            pattern: /^(".*?")\s+disconnected$/i,
            parse: (halflifeLine, playerString) => ({
                type: "player-disconnected",
                payload: {
                    player: this.parsePlayerWithTeam(playerString),
                    reason: halflifeLine.argMap.reason,
                },
            }),
        });

        // "Smashmint<13><STEAM_1:1:24748064><CT>" assisted killing "Micrux ¬ GAMEYE<3><STEAM_1:0:31398789><TERRORIST>"
        halflifeParserList.push({
            pattern: /^(".*?")\s+assisted\s+killing\s+(".*?")/i,
            parse: (halflifeLine, assisterPlayerString, victimPlayerString) => ({
                type: "player-assisted",
                payload: {
                    assister: this.parsePlayerWithTeam(assisterPlayerString),
                    victim: this.parsePlayerWithTeam(victimPlayerString),
                },
            }),
        });

        // "Lau<2><STEAM_1:0:16690820><TERRORIST>" [-478 310 4] killed "Micrux ¬ GAMEYE<3><STEAM_1:0:31398789><CT>" [-383 1079 -6] with "p250"
        halflifeParserList.push({
            pattern: /^(".*?")\s+\[.*\]\s+killed\s+(".*?")/i,
            parse: (halflifeLine, killerPlayerString, victimPlayerString) => ({
                type: "player-killed",
                payload: {
                    killer: this.parsePlayerWithTeam(killerPlayerString),
                    victim: this.parsePlayerWithTeam(victimPlayerString),
                },
            }),
        });

        // "Lau<2><STEAM_1:0:16690820><TERRORIST>" [-1015 -808 194] committed suicide with "world"
        halflifeParserList.push({
            pattern: /^(".*?")\s+(\[.*?\])\s+committed\s+suicide\s+with\s+"(.*?)"/i,
            parse: (halflifeLine, playerString, locationString, cause) => ({
                type: "player-suicide",
                payload: {
                    player: this.parsePlayerWithTeam(playerString),
                    playerPosition: this.parseArray(locationString).map(Number) as event.PositionModel,
                    cause,
                },
            }),
        });

        // "Adam<4><BOT>" switched from team <Unassigned> to <TERRORIST>
        halflifeParserList.push({
            pattern: /^(".*?")\s+switched\s+from\s+team\s+\<(.*?)\>\s+to\s+\<(.*?)\>$/i,
            parse: (halflifeLine, playerString, oldTeam, newTeam) => ({
                type: "player-switched-team",
                payload: {
                    player: this.parsePlayerWithoutTeam(playerString),
                    oldTeam,
                    newTeam,
                },
            }),
        });

        // Team playing "TERRORIST": Gameye
        halflifeParserList.push({
            pattern: /^Team\s+playing\s+"(.*?)":\s+(.*?)$/i,
            parse: (halflifeLine, team, clantag) => ({
                type: "team-playing",
                payload: {
                    team,
                    clantag,
                },
            }),
        });

        // Team "TERRORIST" scored "7" with "1" players
        halflifeParserList.push({
            pattern: /^Team\s+"(\w*)"\s+scored\s+"(\d+)"\s+with\s+"(\d+)"\s+players/i,
            parse: (halflifeLine, team, scoreString, playerString) => ({
                type: "team-score",
                payload: {
                    team,
                    score: Number(scoreString),
                    players: Number(playerString),
                },
            }),
        });

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
