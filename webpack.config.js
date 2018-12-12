const HtmlWebpackPlugin = require("html-webpack-plugin");

const rootPath = __dirname;
const srcPath = rootPath + "/src";

module.exports = {
    mode: "development",
    entry: srcPath + "/index.ts",
    devtool: "sourcemap",
    output: {
        filename: "bundle.js",
        path: rootPath + "/dist",
    },
    resolve: {
        extensions: [".ts", ".js", ".json"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
            },
            {
                test: /\.glsl$/,
                loader: "webpack-glsl-loader"
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: srcPath + "/index.html",
        }),
    ],
};
