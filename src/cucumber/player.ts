import { PlayerContainerState, PlayerModel } from "@gameye/statistic-common";
import * as assert from "assert";
import * as cucumber from "cucumber";
import { GameBag, TestWorld } from ".";

cucumber.Then(
    /^the players (.*) were active in the game$/i,
    async function (playerNames: string | string[]) {
        playerNames = String(playerNames).split(/\s*,\s*/).filter(Boolean);

        const { bag } = this as TestWorld<GameBag>;
        const { game } = bag;
        if (!game) throw new Error(`game not set`);

        const { reducer } = game;
        const state: PlayerContainerState = reducer.getState();

        const expectedPlayerHash = playerNames.reduce(
            (o, i) => Object.assign(o, { [i]: true }),
            {} as { [name: string]: true },
        );

        const actualPlayerHash = Object.values(state.player).
            map(p => p.name).
            reduce(
                (o, i) => Object.assign(o, { [i]: true }),
                {} as { [name: string]: true },
            );

        assert.deepEqual(actualPlayerHash, expectedPlayerHash);
    },
);

cucumber.Then(
    /^player (.+) had (-?\d+) ([a-z]+)s$/i,
    async function (playerName, statisticValue, statisticKey) {
        playerName = String(playerName);
        statisticValue = Number(statisticValue);
        statisticKey = String(statisticKey);

        const { bag } = this as TestWorld<GameBag>;
        const { game } = bag;
        if (!game) throw new Error(`game not set`);

        const { reducer } = game;
        const state: PlayerContainerState = reducer.getState();

        const player = Object.values(state.player).
            reduce<PlayerModel | null>((o, i) => i.name === playerName ? i : o, null);

        if (!player) throw new Error(`player ${playerName} not found`);

        assert.equal(player.statistic[statisticKey], statisticValue);
    },
);

cucumber.Then(
    /^player (.+) had a ([a-z]+) of (-?\d+)$/i,
    async function (playerName, statisticKey, statisticValue) {
        playerName = String(playerName);
        statisticValue = Number(statisticValue);
        statisticKey = String(statisticKey);

        const { bag } = this as TestWorld<GameBag>;
        const { game } = bag;
        if (!game) throw new Error(`game not set`);

        const { reducer } = game;
        const state: PlayerContainerState = reducer.getState();

        const player = Object.values(state.player).
            reduce<PlayerModel | null>((o, i) => i.name === playerName ? i : o, null);

        if (!player) throw new Error(`player ${playerName} not found`);

        assert.equal(player.statistic[statisticKey], statisticValue);
    },
);

cucumber.Then(
    /^player (.+) is (not ready|ready)$/i,
    async function (playerName, readyStat) {
        playerName = String(playerName);
        const statisticValue = readyStat === "ready" ? 1 : 0;
        const statisticKey = "ready";

        const { bag } = this as TestWorld<GameBag>;
        const { game } = bag;
        if (!game) throw new Error(`game not set`);

        const { reducer } = game;
        const state: PlayerContainerState = reducer.getState();

        const player = Object.values(state.player).
            reduce<PlayerModel | null>((o, i) => i.name === playerName ? i : o, null);

        if (!player) throw new Error(`player ${playerName} not found`);

        assert.equal(player.statistic[statisticKey], statisticValue);
    });
