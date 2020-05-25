/* eslint-disable max-len */

import { EventBase } from "@gameye/statistic-common";
import * as moment from "moment";
import * as event from "../event";
import { RegexLogParserBase } from "./regex";

export interface HalflifeLineModel {
    timestamp: number;
    content: string;
    argMap: { [key: string]: string };
}

interface HalflifeLineParser<
    TEvent extends EventBase,
    > {
    pattern: RegExp;
    parse(halflineLine: HalflifeLineModel, ...args: string[]): TEvent;
}

export abstract class HalflifeLogParserBase<TEvent extends EventBase = any>
    extends RegexLogParserBase<TEvent>
{
    private readonly halflifeParserList = new Array<HalflifeLineParser<TEvent>>();

    protected registerHalflifeParser(
        pattern: RegExp,
        parse: (line: HalflifeLineModel, ...args: string[]) => TEvent,
    ) {
        this.halflifeParserList.push({ pattern, parse });
    }

    // "Micrux ¬ GAMEYE<3><STEAM_1:0:31398789><CT>"
    // "Smashmint""<2><STEAM_1:1:24748064><>"
    // "Smashmint<><12><STEAM_1:1:24748064><Unassigned>"
    // "malczyk541"G4SKINS.COM"<5><STEAM_1:0:444334529><>"
    protected parsePlayerWithTeam(playerString: string): event.PlayerWithTeamModel {
        const match = /^"(.*)<(.*?)><(.*?)><(.*?)>"$/i.exec(playerString);
        if (match === null) throw new Error(`${playerString} is not a valid player string (did you include the "'s?)`);

        const [, name, key, uid, team] = match;
        return {
            name, key, uid, team,
        };
    }

    protected parseHalflifeLine(line: string): HalflifeLineModel | undefined {
        if (!line) return;
        line = line.trim();
        if (line === "") return;

        let match: RegExpExecArray | null = null;
        if (match === null) {
            // L 01/01/1970 - 00:01:00: hoppetee 10 xyz (damage "110") (health "0")
            match = /^L\s(\d{2}\/\d{2}\/\d{4})\s-\s(\d{2}:\d{2}:\d{2}):\s(.*?)((?:\s+\(\w+\s+".*?"\))*)$/.exec(line);
        }
        // if (match === null) {
        //     // 08/31/2017 - 15:07:40.146 - Log file started (file "logs/L172_017_000_002_50678_201708311507_000.log") (game "/home/steam/csgo/csgo") (version "6852")
        //     match = /^(\d{2}\/\d{2}\/\d{4})\s\-\s(\d{2}:\d{2}:\d{2}\.\d{3})\s\-\s(.*?)((?:\s+\(\w+\s+".*?"\))*)$/.exec(line);
        // }

        if (!match) return;

        const [, date, time, content, argMapGroup] = match;

        const timestamp = moment(
            `${date} ${time} Z`,
            "MM/DD/YYYY HH:mm:ss.SSS Z",
        ).valueOf();
        const argMap: { [key: string]: string } = {};

        {
            const argMapRe = /\s+\((\w+)\s+"(.*?)"\)/g;
            for (
                let match = argMapRe.exec(argMapGroup);
                match !== null;
                match = argMapRe.exec(argMapGroup)
            ) {
                const [, key, value] = match;
                if (key in argMap)
                    throw new Error(`could not parse "${line}", "${key}" already defined in argument map`);

                argMap[key] = value;
            }

        }

        return {
            timestamp, content, argMap,
        };
    }

    protected parseEventFromLine(line: string): TEvent | undefined {
        {
            const e = super.parseEventFromLine(line);
            if (e) return e;
        }

        const halflineLine = this.parseHalflifeLine(line);
        if (halflineLine) for (const parser of this.halflifeParserList) {
            const match = parser.pattern.exec(halflineLine.content);
            if (!match) continue;

            const e = parser.parse(halflineLine, ...match.slice(1));
            if (e) return e;
        }
    }

}
