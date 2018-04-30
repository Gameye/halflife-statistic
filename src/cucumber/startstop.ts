import { StartStopState } from "@gameye/statistic-common";
import * as assert from "assert";
import * as cucumber from "cucumber";
import { GameBag, TestWorld } from ".";

cucumber.Then("I have a game start timestamp {int}",
    async function (expectedStart) {
        expectedStart = Number(expectedStart);

        const { bag } = this as TestWorld<GameBag>;
        const { game } = bag;
        if (!game) throw new Error(`game not set`);

        const { reducer } = game;
        const state: StartStopState = reducer.getState();

        assert.equal(state.start, expectedStart);
    },
);

cucumber.Then("I have a game stop timestamp {int}",
    async function (expectedStop) {
        expectedStop = Number(expectedStop);

        const { bag } = this as TestWorld<GameBag>;
        const { game } = bag;
        if (!game) throw new Error(`game not set`);

        const { reducer } = game;
        const state: StartStopState = reducer.getState();

        assert.equal(state.stop, expectedStop);
    },
);
