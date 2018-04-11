import { LogReducerBase, PlayerModel, StatePatch } from "@gameye/statistic-common";
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
    ): Iterable<StatePatch> {
        const { state } = this;

        for (const e of events) switch (e.type) {
            case "round-start": {
                const start = e.payload.timestamp;
                if (state.start === null) yield {
                    path: ["start"],
                    value: start,
                };
                break;
            }

            case "game-commencing": {
                const start = e.payload.timestamp;
                yield {
                    path: ["start"],
                    value: start,
                };
                break;
            }

            case "game-over": {
                const stop = e.payload.timestamp;
                yield {
                    path: ["stop"],
                    value: stop,
                };
                break;
            }

            case "player-connected": {
                const playerKey = e.payload.player.key;
                const playerState: PlayerModel = {
                    connected: true,
                    playerKey,
                    uid: e.payload.player.uid,
                    name: e.payload.player.name,
                    statistic: {},
                };

                yield {
                    path: ["player", playerKey],
                    value: playerState,
                };
                break;
            }

            case "player-disconnected": {
                const playerKey = e.payload.player.key;

                yield {
                    path: ["player", playerKey, "connected"],
                    value: false,
                };
                break;
            }
        }

    }
}
