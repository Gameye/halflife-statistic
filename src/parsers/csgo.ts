import { LogParserBase } from "@gameye/statistic-common";
import * as event from "../event";

export type CsGoLogEvents = event.DummyEvent;

export class CsGoLogParser extends LogParserBase<CsGoLogEvents> {

    protected *parseLine(line: string): Iterable<CsGoLogEvents> {
        yield {
            type: "dummy",
            payload: undefined,
        };
    }

}
