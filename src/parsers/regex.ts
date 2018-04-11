import { EventBase, LogParserBase } from "@gameye/statistic-common";
import * as moment from "moment";
import * as event from "../event";

interface RegexLineParser<
    TEvent extends EventBase,
    > {
    pattern: RegExp;
    parse(line: string, ...args: string[]): TEvent;
}

export abstract class RegexLogParserBase<TEvent extends EventBase = any>
    extends LogParserBase<TEvent>
{
    private readonly regexParserList = new Array<RegexLineParser<TEvent>>();

    protected registerRegexParser(
        pattern: RegExp,
        parse: (line: string, ...args: string[]) => TEvent,
    ) {
        this.regexParserList.push({ pattern, parse });
    }

    protected *parseLine(line: string): Iterable<TEvent> {
        const e = this.parseEventFromLine(line);
        if (e) return yield e;
    }

    protected parseEventFromLine(line: string): TEvent | undefined {
        for (const parser of this.regexParserList) {
            const match = parser.pattern.exec(line);
            if (!match) continue;

            const e = parser.parse(line, ...match.slice(1));
            if (e) return e;
        }
    }

}
