import { EventBase, LogReducerBase } from "@gameye/statistic-common";
import "./reducers";

export function createLogReducer(name: string) {
    return LogReducerBase.create(name);
}
