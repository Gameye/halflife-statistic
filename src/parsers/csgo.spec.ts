import * as test from "blue-tape";
import * as path from "path";
import * as events from "../event";
import { projectRoot, readFileAsLines } from "../utils";
import { CsGoLogParser } from "./csgo";

test("CsGoLogParser", async (t) => {
    const parser = new CsGoLogParser();

    const logFilePath = path.join(
        projectRoot,
        "fixtures",
        "logs",
        "csgo",
        "esl1on1-6-rounds-warmup-reconnect-v3.log",
    );
    const lines = await readFileAsLines(logFilePath);

    const es = Array.from(parser.parse(lines));

    t.ok(es.length > 0);
});

test("mp_teammates_are_enemies", async (t) => {
    const parser = new CsGoLogParser();

    const logFilePath = path.join(
        projectRoot,
        "fixtures",
        "logs",
        "csgo",
        "ffa1.log",
    );
    const lines = await readFileAsLines(logFilePath);

    const es = Array.from(parser.parse(lines)).
        filter(e => e.type === "number-parameter-value").
        map(e => e as events.NumberParameterValueEvent).
        filter(e => e.payload.name === "mp_teammates_are_enemies");

    t.equal(es.length, 2);
});

test("bot killed bot", async (t) => {
    const parser = new CsGoLogParser();

    const lines = [
        `L 03/21/2018 - 13:23:47: ` +
        `"Kevin<4><BOT><CT>" [-275 854 -9] killed ` +
        `"Brad<5><BOT><TERRORIST>" [-323 456 60] with "m4a1"`,
    ];

    const es = Array.from(parser.parse(lines));

    t.equal(es.length, 1);
    t.deepEqual(
        es[0],
        {
            type: "player-killed",
            payload: {
                killer: { name: "Kevin", key: "4", uid: "BOT", team: "CT" },
                victim: { name: "Brad", key: "5", uid: "BOT", team: "TERRORIST" },
                timestamp: 1521638627000,
            },
        },
    );
});
