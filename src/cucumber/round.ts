import { RoundState } from "@gameye/statistic-common";
import * as assert from "assert";
import * as cucumber from "cucumber";
import { GameBag, TestWorld } from ".";

cucumber.Then(
    /^I have started (\d+) rounds$/i,
    async function (expectedRound) {
        expectedRound = Number(expectedRound);

        const { bag } = this as TestWorld<GameBag>;
        const { game } = bag;
        if (!game) throw new Error(`game not set`);

        const { reducer } = game;
        const state: RoundState = reducer.getState();

        assert.equal(state.startedRounds, expectedRound);
    },
);

cucumber.Then(
    /^I have finished (\d+) rounds$/i,
    async function (expectedRound) {
        expectedRound = Number(expectedRound);

        const { bag } = this as TestWorld<GameBag>;
        const { game } = bag;
        if (!game) throw new Error(`game not set`);

        const { reducer } = game;
        const state: RoundState = reducer.getState();

        assert.equal(state.finishedRounds, expectedRound);
    },
);
