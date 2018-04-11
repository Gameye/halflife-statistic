import { LogReducerBase } from "@gameye/statistic-common";
import * as cucumber from "cucumber";
import { TestWorld } from ".";
import "../reducers";

export interface GameInfo {
    name: string;
    reducer: LogReducerBase;
}
export interface GameBag {
    game: GameInfo;
}

cucumber.Given(
    /^I play a game of (.+)$/i,
    async function (name) {
        name = String(name);

        const { bag } = this as TestWorld<GameBag>;

        const reducer = LogReducerBase.create(name);
        if (!reducer) throw new Error(`unknown game ${name}`);

        bag.game = { name, reducer };
    },
);
