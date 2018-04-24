// tslint:disable:max-line-length

import { EventBase } from "@gameye/statistic-common";
import * as event from "../event";
import { HalflifeLogParserBase } from "./halflife";

// TODO: should we refactor to  a HalfLiveLogEvents type ??

export type Tf2LogEvents = // assume we share events with CsGo ...
    event.GameCommencingEvent |
    event.GameOverEvent |
    event.MatchStartEvent |
    event.RoundStartEvent |
    event.RoundEndEvent |
    event.PlayerConnectedEvent |
    event.PlayerDisconnectedEvent |
    event.PlayerAssistedEvent |
    event.PlayerKilledEvent |
    event.PlayerSuicideEvent |
    event.PlayerSwitchedTeamEvent |
    event.TeamPlayingEvent |
    event.TeamScoreEvent |
    event.NumberParameterValueEvent;

export class Tf2LogParser extends HalflifeLogParserBase<Tf2LogEvents> {

    constructor() {
        super();
        // TODO: register stuff here ...
    }

}
