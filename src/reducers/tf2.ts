import { LogReducerBase, PlayerModel, StatePatch, TeamModel } from "@gameye/statistic-common";
import { Tf2LogEvents, Tf2LogParser } from "../parsers";
import { Tf2Patch, Tf2State } from "../state";

@LogReducerBase.register("tf2")
export class Tf2LogReducer extends LogReducerBase<Tf2State, Tf2LogEvents>
{
    // TODO: implement the reducer ;-)

    protected createParser() {
        return new Tf2LogParser();
    }

    protected createInitialState() {
        return {
            start: null,
            stop: null,
            startedRounds: 0,
            finishedRounds: 0,
            player: {},
            team: {},
        };
    }

    protected *reduceEvent(
        event: Tf2LogEvents,
    ): Iterable<Tf2Patch> {
        // yield* this.reduceSettingEvent(event);
        // yield* this.reduceStartStopEvent(event);
        // yield* this.reduceRoundStartStopEvent(event);
        // yield* this.reducePlayerEvent(event);
        // yield* this.reduceTeamEvent(event);
    }
}
