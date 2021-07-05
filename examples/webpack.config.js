const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const SanLoaderPlugin = require("san-loader/lib/plugin");

module.exports = {
    entry: path.resolve(__dirname, "./src/index.js"),
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    devtool: "inline-source-map",
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
                        loader: path.resolve(__dirname, "../index.js"),
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
                        loader: path.resolve(__dirname, "../index.js"),
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
                                    require.resolve("@babel/preset-env"),
                                    {
                                        targets: {
                                            browsers: "> 1%, last 2 versions",
                                        },
                                        modules: false,
                                    },
                                ],
                            ],
                        },
                    },
                    {
                        loader: path.resolve(__dirname, '../index.js'),
                        options: {
                            compileTemplate: 'aPack',
                            mode: 'compact'
                        }
                    }
                ],
            },
            {
                test: /\.less$/,
                oneOf: [
                    // 这里匹配 `<style lang="less" module>`
                    {
                        resourceQuery: /module/,
                        use: [
                            'style-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: {
                                        localIdentName: '[local]_[hash:base64:5]'
                                    },
                                    localsConvention: 'camelCase',
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'less-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    },
                    // 这里匹配 `<style lang="less">`
                    {
                        use: [
                            {
                                loader: 'style-loader'
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: {
                                        localIdentName: '[local]_[hash:base64:5]'
                                    },
                                    localsConvention: 'camelCase',
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'less-loader',
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    }
                ]
            },
            {
                test: /\.css$/,

                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: [".js", ".san"],
    },
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        overlay: true,
        hot: true,
        inline: true,
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, "./index.html"),
        }),
        new SanLoaderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
};
