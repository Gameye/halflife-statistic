import { LogReducerBase, PlayerModel, StatePatch, TeamModel } from "@gameye/statistic-common";
import { Tf2LogEvents, Tf2LogParser } from "../parsers";
import { Tf2Patch, Tf2State } from "../state";

@LogReducerBase.register("tf2")
export class Tf2LogReducer extends LogReducerBase<Tf2State, Tf2LogEvents>
{
    // TODO: implement the reducer ;-)
    private gameOver = false;

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

            case "game-commencing": {
                const start = event.payload.timestamp;
                yield {
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

    protected *reduceRoundStartStopEvent(
        event: Tf2LogEvents,
    ): Iterable<Tf2Patch> {
        const { gameOver } = this;
        const state = this.getState();

        switch (event.type) {
            case "match-start": {
                this.gameOver = false;
                yield {
                    path: ["startedRounds"],
                    value: 0,
                };
                yield {
                    path: ["finishedRounds"],
                    value: 0,
                };
                break;
            }
            case "round-start": {
                if (gameOver) break;
                yield {
                    path: ["startedRounds"],
                    value: state.startedRounds + 1,
                };
                break;
            }
            case "round-end": {
                if (gameOver) break;
                yield {
                    path: ["finishedRounds"],
                    value: state.finishedRounds + 1,
                };
                break;
            }
            case "game-over": {
                if (gameOver) break;
                this.gameOver = true;
                break;
            }
        }
    }
}
