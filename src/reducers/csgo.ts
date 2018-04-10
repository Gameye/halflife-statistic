import { LogReducerBase, StatePatch } from "@gameye/statistic-common";
import { CsGoLogEvents, CsGoLogParser } from "../parsers";
import { CsGoState } from "../state";

@LogReducerBase.register("csgo")
export class CsGoLogReducer
    extends LogReducerBase<CsGoState, CsGoLogEvents>
{

    protected parser = new CsGoLogParser();

    protected getInitialState() {
        return {
            start: null,
            stop: null,
            startedRounds: 0,
            finishedRounds: 0,
            player: {},
            team: {},
        };
    }

    protected *reduceEvents(
        events: Iterable<CsGoLogEvents>,
    ): Iterable<StatePatch<CsGoState>> {
        const { state } = this;

        for (const e of events) switch (e.type) {
        }

    }

}
