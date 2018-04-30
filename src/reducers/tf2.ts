import { LogReducerBase, PlayerModel, StatePatch, TeamModel } from "@gameye/statistic-common";
import { Tf2LogEvents, Tf2LogParser } from "../parsers";
import { Tf2Patch, Tf2State } from "../state";

@LogReducerBase.register("tf2")
export class Tf2LogReducer extends LogReducerBase<Tf2State, Tf2LogEvents>
{
    // TODO: implement the reducer ;-)
    private gameOver: boolean = false;
    private roundCount: number = 0;

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
        yield* this.reduceStartStopEvent(event);
        // yield* this.reduceRoundStartStopEvent(event);
        // yield* this.reducePlayerEvent(event);
        // yield* this.reduceTeamEvent(event);
    }

    protected *reduceStartStopEvent(
        event: Tf2LogEvents,
    ): Iterable<Tf2Patch> {
        const state = this.getState();

        switch (event.type) {
            case "round-start": {
                const start = event.payload.timestamp;
                if (!state.start) yield {
                    path: ["start"],
                    value: start,
                };
                break;
            }

            case "game-over": {
                const stop = event.payload.timestamp;
                yield {
                    path: ["stop"],
                    value: stop,
                };
                break;
            }
        }
    }
}
