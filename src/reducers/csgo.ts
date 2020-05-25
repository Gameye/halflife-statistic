/* eslint-disable @typescript-eslint/camelcase */

import { LogReducerBase, PlayerModel, TeamModel } from "@gameye/statistic-common";
import { CsGoLogEvents, CsGoLogParser } from "../parsers";
import { CsGoPatch, CsGoState } from "../state";

@LogReducerBase.register("csgo-cmode")
@LogReducerBase.register("csgo-practice")
@LogReducerBase.register("csgo-get5")
@LogReducerBase.register("csgo-dem")
@LogReducerBase.register("csgo")
export class CsGoLogReducer
    extends LogReducerBase<CsGoState, CsGoLogEvents>
{

    // #region helper state

    private teammatesAreEnemies = false;
    private overtimeRounds = 6;
    private regularRounds = 30;
    private gameOver = false;
    private sideNameHelper = ["CT", "TERRORIST"];
    private sideScoreHelper = [0, 0];
    private teamNameHelper = ["1", "2"];
    private playerSideHelper: {
        [key: string]: number;
    } = {};
    private manualSwapCount = 0;

    // #endregion

    protected createParser() {
        return new CsGoLogParser();
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
        event: CsGoLogEvents,
    ): Iterable<CsGoPatch> {
        yield* this.reduceSettingEvent(event);
        yield* this.reduceStartStopEvent(event);
        yield* this.reduceRoundStartStopEvent(event);
        yield* this.reducePlayerEvent(event);
        yield* this.reduceTeamEvent(event);
        yield* this.reduceGet5Event(event);
    }

    // eslint-disable-next-line require-yield
    protected * reduceSettingEvent(
        event: CsGoLogEvents,
    ): Iterable<CsGoPatch> {
        switch (event.type) {
            case "number-parameter-value": {
                const { payload } = event;
                switch (payload.name) {
                    case "mp_maxrounds":
                        this.regularRounds = payload.value;
                        break;

                    case "mp_overtime_maxrounds":
                        this.overtimeRounds = payload.value;
                        break;

                    case "mp_teammates_are_enemies":
                        this.teammatesAreEnemies = Boolean(event.payload.value);
                        break;
                }
                break;
            }
        }
    }

    protected *reduceStartStopEvent(
        event: CsGoLogEvents,
    ): Iterable<CsGoPatch> {
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
        event: CsGoLogEvents,
    ): Iterable<CsGoPatch> {
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

    protected *reducePlayerEvent(
        event: CsGoLogEvents,
    ): Iterable<CsGoPatch> {
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
                    },
                };

                yield {
                    path: ["player", playerKey],
                    value: playerState,
                } as CsGoPatch;
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
                } as CsGoPatch;
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
                    } as CsGoPatch;
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
                } as CsGoPatch;
                break;
            }

            case "player-killed": {
                const { payload } = event;

                if (payload.killer.team === payload.victim.team) {
                    const playerKey = payload.killer.key;
                    const playerState = state.player[playerKey];
                    if (!playerState) break;

                    const statisticKey = "kill";
                    if (this.teammatesAreEnemies) {
                        yield {
                            path: ["player", playerKey, "statistic", statisticKey],
                            /**
                             * Killing someone is a point when
                             * teammatesAreEnemies is enabled
                             */
                            value: playerState.statistic[statisticKey] + 1,
                        } as CsGoPatch;
                    }
                    else {
                        yield {
                            path: ["player", playerKey, "statistic", statisticKey],
                            /**
                             * Killing someone from your own team will result
                             * in a kill penalty
                             */
                            value: playerState.statistic[statisticKey] - 1,
                        } as CsGoPatch;
                    }
                }
                else {
                    const playerKey = payload.killer.key;
                    const playerState = state.player[playerKey];
                    if (!playerState) break;

                    const statisticKey = "kill";
                    yield {
                        path: ["player", playerKey, "statistic", statisticKey],
                        /**
                         * Ofcourse killing someone from another team will
                         * increase your kill count
                         */
                        value: playerState.statistic[statisticKey] + 1,
                    } as CsGoPatch;
                }

                {
                    const playerKey = payload.victim.key;
                    const playerState = state.player[playerKey];
                    if (!playerState) break;

                    const statisticKey = "death";
                    yield {
                        path: ["player", playerKey, "statistic", statisticKey],
                        /**
                         * If you are killed by anyone, even someone from your
                         * own team, your death count will be increased
                         */
                        value: playerState.statistic[statisticKey] + 1,
                    } as CsGoPatch;
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
                    } as CsGoPatch;
                }

                {
                    const statisticKey = "kill";
                    yield {
                        path: ["player", playerKey, "statistic", statisticKey],
                        /**
                         * Commiting suicide will result in a kill penalty!
                         * The killcount can even go below 0!!!
                         */
                        value: playerState.statistic[statisticKey] - 1,
                    } as CsGoPatch;
                }

                break;
            }

        }

    }

    protected *reduceTeamEvent(
        event: CsGoLogEvents,
    ): Iterable<CsGoPatch> {
        const { regularRounds, overtimeRounds } = this;

        switch (event.type) {

            case "team-playing": {
                const { payload } = event;
                const sideIndex = this.getSideIndex(payload.team);
                const teamIndex = this.getTeamIndex(sideIndex);
                if (teamIndex < 0) break;
                this.teamNameHelper[teamIndex] = payload.clantag;

                yield {
                    path: ["team"],
                    value: this.makeTeamState(),
                };
                break;
            }

            case "team-score": {
                const { payload } = event;
                const sideIndex = this.getSideIndex(payload.team);
                if (sideIndex < 0) break;
                this.sideScoreHelper[sideIndex] = payload.score;

                yield {
                    path: ["team"],
                    value: this.makeTeamState(),
                };
                break;
            }

            case "round-start":
            case "round-end": {
                yield {
                    path: ["team"],
                    value: this.makeTeamState(),
                };
                break;
            }

            case "player-switched-team": {
                const { payload } = event;
                const playerKey = payload.player.key;
                const sideIndex = this.getSideIndex(payload.newTeam);

                this.playerSideHelper[playerKey] = sideIndex;

                yield {
                    path: ["team"],
                    value: this.makeTeamState(),
                };
                break;
            }

        }

    }

    // eslint-disable-next-line require-yield
    protected *reduceGet5Event(
        event: CsGoLogEvents,
    ): Iterable<CsGoPatch> {
        if (event.type !== "get5-event") return;

        switch (event.payload.event) {
            case "knife_won": {
                const { selected_side, winner } = event.payload.params;
                if (
                    winner === "team1" && selected_side === "T" ||
                    winner === "team2" && selected_side === "CT"
                ) {
                    this.manualSwapCount++;
                }
            }
        }
    }

    // #region helper methods

    private getSideIndex(sideName: string) {
        const { sideNameHelper } = this;
        const sideIndex = sideNameHelper.indexOf(sideName);
        return sideIndex;
    }

    private getTeamIndex(sideIndex: number) {
        if (sideIndex < 0) return sideIndex;

        const { regularRounds, overtimeRounds } = this;
        const state = this.getState();
        const switchCount = this.calculateSwitchCount(
            regularRounds, overtimeRounds, state.finishedRounds,
        );
        const teamIndex = (sideIndex + switchCount) % 2;
        return teamIndex;
    }

    private makeTeamState() {
        const { sideNameHelper, sideScoreHelper, teamNameHelper } = this;
        const state = this.getState();
        const team = {} as { [team: string]: TeamModel };
        for (let sideIndex = 0; sideIndex < sideNameHelper.length; sideIndex++) {
            const teamIndex = this.getTeamIndex(sideIndex);
            const score = sideScoreHelper[sideIndex];
            const teamKey = String(teamIndex + 1);
            const name = teamNameHelper[teamIndex];
            const player: {
                [key: string]: true;
            } = {};
            const statistic = {
                score,
            };
            for (const playerKey of Object.keys(this.playerSideHelper).map(String)) {
                if (this.playerSideHelper[playerKey] !== sideIndex) continue;
                player[playerKey] = true;
            }
            team[teamKey] = { teamKey, name, statistic, player };
        }
        return team;
    }

    private calculateSwitchCount(
        regularRounds: number,
        overtimeRounds: number,
        currentRound: number,
    ): number {
        let r = currentRound;
        let s = 0;

        if (r > regularRounds / 2) s++;
        r -= regularRounds;

        while (r > 0) {
            if (r > overtimeRounds / 2) s++;
            r -= overtimeRounds;
        }

        return s + this.manualSwapCount;
    }

    // #endregion
}
