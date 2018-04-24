import {
    PlayerContainerState, RoundState,
    StartStopState, StatePatch, TeamContainerState,
} from "@gameye/statistic-common";

export type Tf2State =
    StartStopState &
    RoundState &
    PlayerContainerState &
    TeamContainerState;

export type Tf2Patch = StatePatch<Tf2State>;
