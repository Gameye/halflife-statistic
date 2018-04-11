import { EventBase, LogParserBase } from "@gameye/statistic-common";
import * as moment from "moment";

export interface HalflifeLineModel<T = any> {
    timestamp: number;
    content: string;
    argMap: { [key: string]: string };
}

export interface HalflifePlayerModel {
    key: string;
    uid: string;
    name: string;
    team: string;
}

export abstract class HalflifeLogParserBase<TEvent extends EventBase = any>
    extends LogParserBase<TEvent>
{
    // "Micrux ¬ GAMEYE<3><STEAM_1:0:31398789><CT>"
    // "Smashmint""<2><STEAM_1:1:24748064><>"
    // "Smashmint<><12><STEAM_1:1:24748064><Unassigned>"
    protected parseHalflifePlayer(playerString: string): HalflifePlayerModel {
        const match = /^"(.*)\<(.*?)\>\<(.*?)\>\<(.*?)\>"$/i.exec(playerString);
        if (match === null) throw new Error(`${playerString} is not a valid player string (did you include the "'s?)`);

        const [, name, key, uid, team] = match;
        return {
            name, key, uid, team,
        };
    }

    protected parseHalflifeLine(line: string): HalflifeLineModel | null {
        // tslint:disable:max-line-length

        if (line === null) return null;
        line = line.trim();
        if (line === "") return null;

        let match: RegExpExecArray | null = null;
        if (match === null) {
            // tslint:disable-next-line:max-line-length
            // L 01/01/1970 - 00:01:00: hoppetee 10 xyz (damage "110") (health "0")
            match = /^L\s(\d{2}\/\d{2}\/\d{4})\s\-\s(\d{2}:\d{2}:\d{2}):\s(.*?)((?:\s+\(\w+\s+".*?"\))*)$/.exec(line);
        }
        // if (match === null) {
        //     // 08/31/2017 - 15:07:40.146 - Log file started (file "logs/L172_017_000_002_50678_201708311507_000.log") (game "/home/steam/csgo/csgo") (version "6852")
        //     match = /^(\d{2}\/\d{2}\/\d{4})\s\-\s(\d{2}:\d{2}:\d{2}\.\d{3})\s\-\s(.*?)((?:\s+\(\w+\s+".*?"\))*)$/.exec(line);
        // }

        if (!match) return null;

        const [, date, time, content, argMapGroup] = match;

        const timestamp = moment(
            `${date} ${time} Z`,
            "MM/DD/YYYY HH:mm:ss.SSS Z",
        ).valueOf();
        const argMap: { [key: string]: string } = {};

        {
            const argMapRe = /\s+\((\w+)\s+"(.*?)"\)/g;
            for (
                // tslint:disable-next-line:no-shadowed-variable
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
}
