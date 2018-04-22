import {
    PlayerContainerState, RoundState,
    StartStopState, StatePatch, TeamContainerState,
} from "@gameye/statistic-common";

export type CsGoState =
    StartStopState &
    RoundState &
    PlayerContainerState &
    TeamContainerState;

export type CsGoPatch = StatePatch<CsGoState>;
