"use strict";

const path = require("path");

const test = require("ava");
const webpack = require("webpack");
const SanLoaderPlugin = require("san-loader/lib/plugin");

function createBundle(entry, bundleName) {
    return new Promise((resolve, reject) => {
        webpack(
            {
                entry: path.resolve(__dirname, entry),
                mode: "development",
                module: {
                    rules: [
                        {
                            test: /\.san$/,
                            use: [
                                {
                                    loader: "san-hot-loader",
                                },
                                {
                                    loader: "san-loader",
                                },
                            ],
                        },
                        {
                            test: /\.pug$/,
                            use: [
                                {
                                    loader: "html-loader",
                                },
                                {
                                    loader: path.resolve(
                                        __dirname,
                                        "../index.js"
                                    ),
                                    options: {
                                        compileTemplate: "aNode",
                                    },
                                },
                                {
                                    loader: "pug-plain-loader",
                                },
                            ],
                        },
                        {
                            test: /\.html$/,
                            use: [
                                {
                                    loader: "html-loader",
                                    options: {
                                        esModule: false,
                                        minimize: false,
                                    },
                                },
                                {
                                    loader: path.resolve(
                                        __dirname,
                                        "../index.js"
                                    ),
                                    options: {
                                        compileTemplate: "aPack",
                                    },
                                },
                            ],
                        },
                        {
                            test: /\.js$/,
                            use: [
                                {
                                    loader: "babel-loader",
                                    options: {
                                        plugins: [
                                            require.resolve(
                                                "@babel/plugin-proposal-class-properties"
                                            ),
                                            require.resolve(
                                                "san-hot-loader/lib/babel-plugin"
                                            ),
                                        ],
                                        presets: [
                                            [
                                                require.resolve(
                                                    "@babel/preset-env"
                                                ),
                                                {
                                                    targets: {
                                                        browsers:
                                                            "> 1%, last 2 versions",
                                                    },
                                                    modules: false,
                                                },
                                            ],
                                        ],
                                    },
                                },
                            ],
                        },
                    ],
                },
                resolve: {
                    extensions: [".js", ".san"],
                },
                plugins: [
                    new SanLoaderPlugin(),
                ],
                output: {
                    libraryTarget: "commonjs2",
                    path: __dirname + "/output",
                    filename: bundleName,
                },
            },
            function onCompilationFinished(err, stats) {
                if (err) {
                    return reject(err);
                }
                if (stats.hasErrors()) {
                    return reject(stats.compilation.errors[0]);
                }
                if (stats.hasWarnings()) {
                    return reject(stats.compilation.warnings[0]);
                }

                resolve(require(`./output/${bundleName}`));
            }
        );
    });
}

test("普通html", async (t) => {
    t.plan(1);
    const bundle = await createBundle("case1/index.js", "bundle1.js");
    t.snapshot(bundle);
});

test("使用pug模版", async (t) => {
    t.plan(1);
    const bundle = await createBundle("case2/index.js", "bundle2.js");
    t.snapshot(bundle);
});
