const path = require("path");
const webpack = require("webpack")
const pkg = require("./package");

module.exports = {
    mode: "production",
    // devtool: "inline-source-map",
    entry: "./src/factory.ts",
    output: {
        libraryTarget: "this",
        path: path.resolve(__dirname, "pub"),
        filename: "factory.js"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.webpack.json"
                    }
                },
                include: path.resolve(__dirname, "src"),
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    externals: {
        "fs": "undefined",
        "aws-sdk": "undefined",
    },
}