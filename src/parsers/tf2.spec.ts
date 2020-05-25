import * as path from "path";
import * as test from "tape-promise/tape";
import { projectRoot, readFileAsLines } from "../utils";
import { Tf2LogParser } from "./tf2";

test("Tf2LogParser", async (t) => {
    const parser = new Tf2LogParser();

    const logFilePath = path.join(
        projectRoot,
        "fixtures",
        "logs",
        "tf2",
        "tf2-6v6test-payload.log",
    );
    const lines = await readFileAsLines(logFilePath);

    const events = Array.from(parser.parse(lines));

    t.ok(events.length > 0);
});
