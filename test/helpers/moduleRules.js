import path from "path";

export default (loaderOptions) => [
    {
        test: /\.san$/,
        use: [
            {
                loader: 'san-loader',
            },
        ],
    },
    {
        test: /\.pug$/,
        use: [
            {
                loader: require.resolve('./testLoader'),
            },
            {
                loader: 'html-loader',
            },
            {
                loader: path.resolve(__dirname, '../../index.js'),
                options: loaderOptions || {},
            },
            {
                loader: 'pug-plain-loader',
            },
        ],
    },
    {
        test: /\.html$/,
        use: [
            {
                loader: require.resolve('./testLoader'),
            },
            {
                loader: 'html-loader',
                options: {
                    esModule: false,
                    minimize: false,
                },
            },
            {
                loader: path.resolve(__dirname, '../../index.js'),
                options: loaderOptions || {},
            },
        ],
    },
    {
        test: /\.js$/,
        use: [
            {
                loader: 'babel-loader',
                options: {
                    plugins: [
                        require.resolve(
                            '@babel/plugin-proposal-class-properties'
                        ),
                    ],
                    presets: [
                        [
                            require.resolve('@babel/preset-env'),
                            {
                                targets: {
                                    browsers: '> 1%, last 2 versions',
                                },
                                modules: "commonjs",
                            },
                        ],
                    ],
                },
            },
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
                                localIdentName: '[local]_[hash:base64:5]',
                            },
                            localsConvention: 'camelCase',
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            // 这里匹配 `<style lang="less">`
            {
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]_[hash:base64:5]',
                            },
                            localsConvention: 'camelCase',
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
    {
        test: /\.css$/,

        use: [
            {
                loader: 'style-loader',
            },
            {
                loader: 'css-loader',
                options: {
                    sourceMap: true,
                },
            },
        ],
    },
];
