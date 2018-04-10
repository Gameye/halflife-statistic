import { LogReducerBase } from "@gameye/statistic-common";
import * as cucumber from "cucumber";
import { TestWorld } from ".";

export interface ReducerBag<TState extends object = any> {
    reducer: LogReducerBase<TState>;
}

cucumber.Given(/^I am using the (\w+) reducer$/i, async function (
    reducerName,
) {
    reducerName = String(reducerName);
    const { bag } = this as TestWorld<ReducerBag>;
    bag.reducer = LogReducerBase.create(reducerName);
});
