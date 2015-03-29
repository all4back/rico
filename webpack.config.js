var env = process.env.NODE_ENV || "development";
var path = require("path");
var webpack = require("webpack");

var plugins = [
    new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(env)
    })
];

if (env === "production") {
    plugins.push(
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin()
    );
}

module.exports = {
    entry: "./src/client.js",

    output: {
        filename: env === "production" ? "rico.min.js" : "rico.js",
        path: path.resolve("public"),
        library: "rico",
        libraryTarget: "umd"
    },

    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel" }
        ]
    },

    plugins: plugins,

    externals: {
        rx: "Rx"
    },

    devtool: "source-map"
};
