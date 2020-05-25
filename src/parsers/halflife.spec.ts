import { EventBase } from "@gameye/statistic-common";
import * as test from "tape-promise/tape";
import { HalflifeLineModel, HalflifeLogParserBase } from "./halflife";

test("HalflifeLogParserBase", async t => {
    type TestLogParserEvents = EventBase<"halflife-line", HalflifeLineModel>;

    class TestLogParser extends HalflifeLogParserBase<TestLogParserEvents> {

        constructor() {
            super();

            this.registerHalflifeParser(
                /^.*$/i,
                halflifeLine => ({
                    type: "halflife-line",
                    payload: halflifeLine,
                }),
            );
        }
    }

    const parser = new TestLogParser();

    const lines = Array.from(parser.parse([
        `mp_buy_anywhere - 0`,
        `L 03/05/2018 - 12:22:00: "sv_kick_ban_duration" = "0"`,
        `L 03/05/2018 - 12:26:46: "Smashmint<5><STEAM_1:1:24748064><Unassigned>" triggered "clantag" (value "")`,
        `L 03/26/2018 - 13:20:22: Team "Blue" triggered "pointcaptured" (cp "2") (cpname "Middle Point") (numcappers "1") (player1 "Smashmint<3><[U:1:49496129]><Blue>") (position1 "-39 -1 487")`,
    ])).map(i => i.payload);

    t.deepEqual(lines, [
        {
            timestamp: new Date("2018-03-05 12:22:00 Z").valueOf(),
            content: `"sv_kick_ban_duration" = "0"`,
            argMap: {},
        },
        {
            timestamp: new Date("2018-03-05 12:26:46 Z").valueOf(),
            content: `"Smashmint<5><STEAM_1:1:24748064><Unassigned>" triggered "clantag"`,
            argMap: { value: "" },
        },
        {
            timestamp: new Date("2018-03-26 13:20:22 Z").valueOf(),
            content: `Team "Blue" triggered "pointcaptured"`,
            argMap: {
                cp: "2",
                cpname: "Middle Point",
                numcappers: "1",
                player1: "Smashmint<3><[U:1:49496129]><Blue>",
                position1: "-39 -1 487",
            },
        },
    ]);

});
