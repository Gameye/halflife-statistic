import { LogReducerBase, PlayerModel, StatePatch, TeamContainerState, TeamModel } from "@gameye/statistic-common";
import { Tf2LogEvents, Tf2LogParser } from "../parsers";
import { Tf2Patch, Tf2State } from "../state";

@LogReducerBase.register("tf2")
export class Tf2LogReducer extends LogReducerBase<Tf2State, Tf2LogEvents>
{
    private gameOver: boolean = false;
    private gameMode: string = "";

    private statsHelper = {
        "player-assisted": "assist",
        "player-dominated": "domination",
        "player-revenged": "revenge",
        "player-defensed": "defense",
        "player-destructed": "destruction",
        "player-ubercharged": "ubercharge",
    };

    private zeroStatistics = {
        assist: 0,
        death: 0,
        kill: 0,
        headshot: 0,
        backstab: 0,
        revenge: 0,
        domination: 0,
        defense: 0,
        destruction: 0,
        ubercharge: 0,
    };

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
            team: {
                Red: {
                    teamKey: "Red",
                    name: "Red",
                    statistic: {
                        score: 0,
                    },
                    player: {},
                } as TeamModel,
                Blue: {
                    teamKey: "Blue",
                    name: "Blue",
                    statistic: {
                        score: 0,
                    },
                    player: {},
                } as TeamModel,
            },
        };
    }

    protected * reduceEvent(
        event: Tf2LogEvents,
    ): Iterable<Tf2Patch> {
        yield* this.reduceStartStopEvent(event);
        yield* this.reduceRoundStartStopEvent(event);
        yield* this.reducePlayerEvent(event);
        yield* this.reduceTeamEvent(event);
    }

    protected * reduceStartStopEvent(
        event: Tf2LogEvents,
    ): Iterable<Tf2Patch> {
        const state = this.getState();

        switch (event.type) {

            case "string-parameter-value": {
                if (event.payload.name === "gameMode") {
                    this.gameMode = event.payload.value;
                }
                break;
            }

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

    protected * reduceRoundStartStopEvent(
        event: Tf2LogEvents,
    ): Iterable<Tf2Patch> {
        const { gameOver } = this;
        const state = this.getState();

        switch (event.type) {
            case "round-start": {
                if (gameOver) break;
                if (state.finishedRounds < state.startedRounds) break;
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

    protected * reduceTeamEvent(
        event: Tf2LogEvents,
    ): Iterable<Tf2Patch> {
        const state = this.getState();

        switch (event.type) {

            case "player-joined-team": {
                const { payload } = event;
                const playerKey = payload.player.key;
                const oldTeamKey = payload.player.team;
                const newTeamKey = payload.newTeam;

                if (
                    state.team[oldTeamKey] &&
                    state.team[oldTeamKey].player[playerKey]
                ) {
                    yield {
                        path: ["team", oldTeamKey, "player", playerKey],
                        value: false,
                    } as Tf2Patch;
                }

                yield {
                    path: ["team", newTeamKey, "player", playerKey],
                    value: true,
                } as Tf2Patch;

                break;
            }

            case "team-pointcaptured": {
                if (this.gameMode !== "payload") break;

                const { payload } = event;
                const teamKey = payload.team;
                const score = payload.score;

                yield {
                    path: ["team", teamKey, "statistic", "score"],
                    value: score,
                } as Tf2Patch;
                break;
            }

            case "team-score": {
                if (this.gameMode === "payload") break;

                const { payload } = event;
                const teamKey = payload.team;
                const score = payload.score;

                yield {
                    path: ["team", teamKey, "statistic", "score"],
                    value: score,
                } as Tf2Patch;
                break;
            }

            case "round-start": {
                if (this.gameMode !== "payload") break;

                // switch the team scores
                // [this.activeTeams.team.Blue.statistic.score,
                // this.activeTeams.team.Red.statistic.score] = [this.activeTeams.team.Red.statistic.score,
                // this.activeTeams.team.Blue.statistic.score];

                // yield {
                //     path: ["team"],
                //     value: this.activeTeams.team,
                // };
                break;
            }

        }
    }

    protected * reducePlayerEvent(
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
                    statistic: this.zeroStatistics,
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
                        value: this.zeroStatistics,
                    } as Tf2Patch;
                }
                break;
            }

            case "player-assisted": {
                const { payload } = event;

                const playerKey = payload.assister.key;
                const playerState = state.player[playerKey];
                if (!playerState) break;

                const statisticKey = this.statsHelper[event.type];

                yield {
                    path: ["player", playerKey, "statistic", statisticKey],
                    value: playerState.statistic[statisticKey] + 1,
                } as Tf2Patch;
                break;
            }

            case "player-dominated":
            case "player-revenged":
            case "player-defensed":
            case "player-destructed":
            case "player-ubercharged": {
                const { payload } = event;

                const playerKey = payload.player.key;
                const playerState = state.player[playerKey];
                if (!playerState) break;

                const statisticKey = this.statsHelper[event.type];

                yield {
                    path: ["player", playerKey, "statistic", statisticKey],
                    value: playerState.statistic[statisticKey] + 1,
                } as Tf2Patch;
                break;
            }

            case "player-killed": {
                const { payload } = event;
                {
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
                }

                {
                    const playerKey = payload.victim.key;
                    const playerState = state.player[playerKey];

                    yield {
                        path: ["player", playerKey, "statistic", "death"],
                        /**
                         * If you are killed by anyone, even someone from your
                         * own team, your death count will be increased
                         */
                        value: playerState.statistic.death + 1,
                    } as Tf2Patch;
                }
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
