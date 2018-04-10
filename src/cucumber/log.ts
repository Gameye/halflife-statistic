import * as cucumber from "cucumber";
import * as path from "path";
import { ReducerBag, TestWorld } from ".";
import { projectRoot, readFileAsLines } from "../utils";

export interface LogInfo {
    fileName: string;
    lines: string[];
}

export interface LogBag {
    log: LogInfo;
}

cucumber.When(
    /^read the (.*) logfile$/i,
    async function (fileName) {
        fileName = String(fileName);

        const { bag } = this as TestWorld<LogBag & ReducerBag>;
        const { reducer } = bag as ReducerBag;

        const filePath = path.join(
            projectRoot, "fixtures", fileName,
        );
        const lines = await readFileAsLines(filePath);
        bag.log = { fileName, lines };

        reducer.reduce(lines);
    },
);
