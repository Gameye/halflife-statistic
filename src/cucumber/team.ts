import { PlayerContainerState, TeamContainerState } from "@gameye/statistic-common";
import * as assert from "assert";
import * as cucumber from "cucumber";
import { GameBag, TestWorld } from ".";

cucumber.Then(
    /^team (.+) has a score of (\d+)$/i,
    async function (teamName, teamScore) {
        teamName = String(teamName);
        teamScore = Number(teamScore);

        const { bag } = this as TestWorld<GameBag>;
        const { game } = bag;
        if (!game) throw new Error(`game not set`);

        const { reducer } = game;
        const state: TeamContainerState = reducer.getState();

        const [teamItem] = Object.values(state.team).filter(i => i.name === teamName);

        if (!teamItem) throw new Error(`team '${teamName}' not found`);

        assert.equal(teamItem.statistic.score, teamScore);
    },
);

cucumber.Then(
    /^the first team is called (.+)$/i,
    async function (teamName) {
        teamName = String(teamName);

        const { bag } = this as TestWorld<GameBag>;
        const { game } = bag;
        if (!game) throw new Error(`game not set`);

        const { reducer } = game;
        const state: TeamContainerState = reducer.getState();

        const teamItem = state.team["1"];

        assert.equal(teamItem.name, teamName);
    },
);

cucumber.Then(
    /^the second team is called (.+)$/i,
    async function (teamName) {
        teamName = String(teamName);

        const { bag } = this as TestWorld<GameBag>;
        const { game } = bag;
        if (!game) throw new Error(`game not set`);

        const { reducer } = game;
        const state: TeamContainerState = reducer.getState();

        const teamItem = state.team["2"];

        assert.equal(teamItem.name, teamName);
    },
);

cucumber.Then(
    /^team (.*) consists of (.*) as the players$/i,
    async function (teamName, playerNames) {
        teamName = String(teamName);
        playerNames = String(playerNames).split(/\s*,\s*/).filter(Boolean);

        const expectedPlayers = (playerNames as string[]).
            reduce((o, i) => Object.assign(o, { [i]: true }), {});
        const { bag } = this as TestWorld<GameBag>;
        const { game } = bag;
        if (!game) throw new Error(`game not set`);

        const { reducer } = game;
        const state: TeamContainerState & PlayerContainerState = reducer.getState();

        const [teamItem] = Object.values(state.team).filter(i => i.name === teamName);

        if (!teamItem) throw new Error(`team '${teamName}' not found`);

        const actualPlayers = Object.keys(teamItem.player).map(String).
            filter(uid => teamItem.player[uid]).
            map(uid => state.player[uid].name).
            reduce((o, i) => Object.assign(o, { [i]: true }), {});

        assert.deepEqual(actualPlayers, expectedPlayers);
    },
);
