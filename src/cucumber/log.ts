import * as cucumber from "cucumber";
import * as path from "path";
import { GameBag, TestWorld } from ".";
import { projectRoot, readFileAsLines } from "../utils";

export interface LogInfo {
    fileName: string;
}

export interface LogBag {
    log: LogInfo;
}

cucumber.Given(
    /^I store logs in (.*)$/i,
    async function (fileName) {
        fileName = String(fileName);

        const { bag } = this as TestWorld<LogBag>;

        bag.log = { fileName };
    },
);

cucumber.When(
    /^I process the logs$/i,
    async function () {
        const { bag } = this as TestWorld<LogBag & GameBag>;
        const { game, log } = bag;
        if (!game) throw new Error(`game not set`);
        if (!log) throw new Error(`log not set`);

        const { reducer } = game;
        const { fileName } = log;

        const filePath = path.join(
            projectRoot, "fixtures", "logs", game.name, fileName,
        );
        const lines = await readFileAsLines(filePath);
        reducer.reduce(lines);
    },
);

cucumber.When(
    /^I process the first (\d+) log lines$/i,
    async function (line) {
        line = Number(line);

        const { bag } = this as TestWorld<LogBag & GameBag>;
        const { game, log } = bag;
        if (!game) throw new Error(`game not set`);
        if (!log) throw new Error(`log not set`);

        const { reducer } = game;
        const { fileName } = log;

        const filePath = path.join(
            projectRoot, "fixtures", "logs", game.name, fileName,
        );
        const lines = await readFileAsLines(filePath);
        reducer.reduce(lines.slice(0, line));
    },
);
