import {
    PlayerContainerState, RoundState,
    StartStopState, TeamContainerState,
} from "@gameye/statistic-common";

export type CsGoState =
    StartStopState &
    RoundState &
    PlayerContainerState &
    TeamContainerState;
