import { PlayerContainerState, PlayerModel } from "@gameye/statistic-common";
import * as assert from "assert";
import * as cucumber from "cucumber";
import { GameBag, TestWorld } from ".";

cucumber.Then(
    /^player (.+) had (\-?\d+) ([a-z]+)s$/i,
    async function (playerName, statisticCount, statisticKey) {
        playerName = String(playerName);
        statisticCount = Number(statisticCount);
        statisticKey = String(statisticKey);

        const { bag } = this as TestWorld<GameBag>;
        const { game } = bag;
        if (!game) throw new Error(`game not set`);

        const { reducer } = game;
        const state: PlayerContainerState = reducer.getState();

        const player = Object.values(state.player).
            reduce<PlayerModel | null>((o, i) => i.name === playerName ? i : o, null);

        if (!player) throw new Error(`player ${playerName} not found`);

        assert.equal(player.statistic[statisticKey], statisticCount);
    },
);
