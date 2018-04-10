import * as fs from "fs";
import * as readline from "readline";

export async function readFileAsLines(filePath: string) {
    const result = new Array<string>();
    const stream = fs.createReadStream(filePath, { encoding: "utf8" });
    const reader = readline.createInterface(stream);
    reader.on("line", line => result.push(line));
    await new Promise((resolve, reject) => {
        reader.on("error", reject);
        reader.on("close", resolve);
    });
    return result;
}
