const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: __dirname + "/src/index.ts",
    devtool: "sourcemap",
    devServer: {
        contentBase: "/dist",
    },
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist",
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
            {
                test: /\.(jpg)$/,
                loader: "file-loader"
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: __dirname + "/src/index.html",
        }),
    ],
};
