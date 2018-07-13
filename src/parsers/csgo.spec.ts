import * as test from "blue-tape";
import * as path from "path";
import * as events from "../event";
import { projectRoot, readFileAsLines } from "../utils";
import { CsGoLogEvents, CsGoLogParser } from "./csgo";

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
