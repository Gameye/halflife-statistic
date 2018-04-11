import * as test from "blue-tape";
import * as path from "path";
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

    const events = Array.from(parser.parse(lines));

    t.ok(events.length > 0);
});
