import { LogReducerBase, PlayerModel, StatePatch, TeamModel } from "@gameye/statistic-common";
import { Tf2LogEvents, Tf2LogParser } from "../parsers";
import { Tf2Patch, Tf2State } from "../state";

@LogReducerBase.register("tf2")
export class Tf2LogReducer extends LogReducerBase<Tf2State, Tf2LogEvents>
{
    // TODO: implement the reducer ;-)
    private gameOver: boolean = false;
    private roundId: string = "";
    private roundCount: number = 0;
    private sides = ["Red", "Blue"];
    private sideScoreHelper = [0, 0];
    private teamNameHelper = ["1", "2"];
    private playerHelper: {
        [key: string]: number;
    } = {};

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
        yield* this.reduceRoundStartStopEvent(event);
        yield* this.reducePlayerEvent(event);
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

    protected *reduceRoundStartStopEvent(
        event: Tf2LogEvents,
    ): Iterable<Tf2Patch> {
        const { gameOver } = this;
        const state = this.getState();

        switch (event.type) {
            case "round-start": {
                this.gameOver = false;
                if (this.roundCount === 0) {
                    yield {
                        path: ["startedRounds"],
                        value: 0,
                    };
                    yield {
                        path: ["finishedRounds"],
                        value: 0,
                    };
                }
                this.roundCount++;
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
            case "game-over": {
                if (gameOver) break;
                this.gameOver = true;
                break;
            }
        }
    }

    protected *reduceTeamEvent(
        event: Tf2LogEvents,
    ): Iterable<Tf2Patch> {

        switch (event.type) {

            // case "team-playing": {
            //     const { payload } = event;
            //     const sideIndex = this.getSideIndex(payload.team);
            //     const teamIndex = this.getTeamIndex(sideIndex);
            //     if (teamIndex < 0) break;
            //     this.teamNameHelper[teamIndex] = payload.clantag;

            //     yield {
            //         path: ["team"],
            //         value: this.makeTeamState(),
            //     };
            //     break;
            // }

            // case "team-score": {
            //     const { payload } = event;
            //     const sideIndex = this.getSideIndex(payload.team);
            //     if (sideIndex < 0) break;
            //     this.sideScoreHelper[sideIndex] = payload.score;

            //     yield {
            //         path: ["team"],
            //         value: this.makeTeamState(),
            //     };
            //     break;
            // }

            // case "round-start":
            // case "round-end": {
            //     yield {
            //         path: ["team"],
            //         value: this.makeTeamState(),
            //     };
            //     break;
            // }

            // case "player-switched-team": {
            //     const { payload } = event;
            //     const playerKey = payload.player.key;
            //     const sideIndex = this.getSideIndex(payload.newTeam);

            //     this.playerHelper[playerKey] = sideIndex;

            //     yield {
            //         path: ["team"],
            //         value: this.makeTeamState(),
            //     };
            //     break;
            // }

        }

    }

    protected *reducePlayerEvent(
        event: Tf2LogEvents,
    ): Iterable<Tf2Patch> {
        const state = this.getState();

        switch (event.type) {

            case "player-connected": {
                const playerKey = event.payload.player.key;
                const playerState: PlayerModel = {
                    connected: true,
                    playerKey,
                    uid: event.payload.player.uid,
                    name: event.payload.player.name,
                    statistic: {
                        assist: 0,
                        death: 0,
                        kill: 0,
                        headshot: 0,
                        backstab: 0,
                    },
                };

                yield {
                    path: ["player", playerKey],
                    value: playerState,
                } as Tf2Patch;
                break;
            }

            case "player-disconnected": {
                const playerKey = event.payload.player.key;

                const playerState = state.player[playerKey];
                if (!playerState) break;
                if (!playerState.connected) break;
                yield {
                    path: ["player", playerKey, "connected"],
                    value: false,
                } as Tf2Patch;
                break;
            }

            case "match-start": {
                for (const playerKey of Object.keys(state.player).map(String)) {
                    yield {
                        path: ["player", playerKey, "statistic"],
                        value: {
                            assist: 0,
                            death: 0,
                            kill: 0,
                        },
                    } as Tf2Patch;
                }
                break;
            }

            case "player-assisted": {
                const { payload } = event;

                const playerKey = payload.assister.key;
                const playerState = state.player[playerKey];
                if (!playerState) break;

                const statisticKey = "assist";
                yield {
                    path: ["player", playerKey, "statistic", statisticKey],
                    value: playerState.statistic[statisticKey] + 1,
                } as Tf2Patch;
                break;
            }

            case "player-killed": {
                const { payload } = event;
                const playerKey = payload.killer.key;
                const playerState = state.player[playerKey];

                if (!playerState) break;

                const fiendlyFire = (payload.killer.team === payload.victim.team);
                // Killing someone from your own team will result in a kill penalty
                const killScore = (fiendlyFire ? -1 : +1);

                yield {
                    path: ["player", playerKey, "statistic", "kill"],
                    value: playerState.statistic.kill + killScore,
                } as Tf2Patch;

                if (payload.customkill) {
                    yield {
                        path: ["player", playerKey, "statistic", payload.customkill],
                        value: playerState.statistic[payload.customkill] + killScore,
                    } as Tf2Patch;
                }

                yield {
                    path: ["player", playerKey, "statistic", "death"],
                    /**
                     * If you are killed by anyone, even someone from your
                     * own team, your death count will be increased
                     */
                    value: playerState.statistic.death + 1,
                } as Tf2Patch;

                break;
            }

            case "player-suicide": {
                const { payload } = event;
                const playerKey = payload.player.key;
                const playerState = state.player[playerKey];
                if (!playerState) break;

                {
                    const statisticKey = "death";
                    yield {
                        path: ["player", playerKey, "statistic", statisticKey],
                        /**
                         * commiting suicide will increase your death count
                         */
                        value: playerState.statistic[statisticKey] + 1,
                    } as Tf2Patch;
                }

                // {
                //     const statisticKey = "kill";
                //     yield {
                //         path: ["player", playerKey, "statistic", statisticKey],
                //         /**
                //          * Commiting suicide will result in a kill penalty!
                //          * The killcount can even go below 0!!!
                //          */
                //         value: playerState.statistic[statisticKey] - 1,
                //     } as Tf2Patch;
                // }

                break;
            }

        }

    }

}
