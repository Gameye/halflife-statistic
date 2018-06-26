import { StartStopState } from "@gameye/statistic-common";
import * as assert from "assert";
import * as cucumber from "cucumber";
import * as moment from "moment";
import { GameBag, TestWorld } from ".";

cucumber.Then(
    /^I have a game start timestamp (.*) - (.*)$/i,
    async function (expectedStartDate, expectedStartTime) {
        const expectedStart = moment(
            `${expectedStartDate} ${expectedStartTime} Z`,
            "MM/DD/YYYY HH:mm:ss.SSS Z",
        );

        const { bag } = this as TestWorld<GameBag>;
        const { game } = bag;
        if (!game) throw new Error(`game not set`);

        const { reducer } = game;
        const state: StartStopState = reducer.getState();

        assert.equal(
            moment(state.start || 0).toString(),
            expectedStart.toString(),
        );
    },
);

cucumber.Then(
    /^I have a game stop timestamp (.*) - (.*)$/i,
    async function (expectedStopDate, expectedStopTime) {
        const expectedStop = moment(
            `${expectedStopDate} ${expectedStopTime} Z`,
            "MM/DD/YYYY HH:mm:ss.SSS Z",
        );

        const { bag } = this as TestWorld<GameBag>;
        const { game } = bag;
        if (!game) throw new Error(`game not set`);

        const { reducer } = game;
        const state: StartStopState = reducer.getState();

        assert.equal(
            moment(state.stop || 0).toString(),
            expectedStop.toString(),
        );
    },
);

cucumber.Then(
    /^the game has ended$/i,
    async function () {
        const { bag } = this as TestWorld<GameBag>;
        const { game } = bag;
        if (!game) throw new Error(`game not set`);

        const { reducer } = game;
        const state: StartStopState = reducer.getState();

        assert.notEqual(
            state.stop,
            null,
        );
    },
);
