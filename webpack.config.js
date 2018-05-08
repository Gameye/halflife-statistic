const path = require("path");
const webpack = require("webpack")
const pkg = require("./package");

module.exports = {
    mode: "none",
    // devtool: "inline-source-map",
    entry: "./node/factory.js",
    output: {
        libraryTarget: "this",
        path: path.resolve(__dirname, "pub"),
        filename: "factory.js"
    },
    externals: {
        "fs": "undefined",
        "aws-sdk": "undefined",
    },
}