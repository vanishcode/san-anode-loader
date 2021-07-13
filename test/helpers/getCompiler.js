import path from "path";

import webpack from "webpack";
import fs from "memfs";
import SanLoaderPlugin  from 'san-loader/lib/plugin';
import joinPath from 'memory-fs/lib/join';

function ensureWebpackMemoryFs (fs) {
  if (fs.join) {
    return fs
  }
  // 处理 join 不存在的问题。。
  const nextFs = Object.create(fs)
  nextFs.join = joinPath
  return nextFs
}

export default (fixture, loaderOptions = {}, config = {}) => {
  const fullConfig = {
    mode: "development",
    devtool: config.devtool || false,
    context: path.resolve(__dirname, "../fixtures"),
    entry: path.resolve(__dirname, "../fixtures", fixture),
    output: {
      path: path.resolve(__dirname, "../outputs"),
      filename: "[name].bundle.js",
      chunkFilename: "[name].chunk.js",
      library: "aNodeLoaderExport",
    },
    module: {
      rules: [
        {
            test: /\.san$/,
            use: [
                {
                    loader: 'san-hot-loader',
                },
                {
                    loader: 'san-loader',
                },
            ],
        },
        {
            test: /\.pug$/,
            use: [
                {
                    loader: 'html-loader',
                },
                {
                    loader: path.resolve(__dirname, "../../index.js"),
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
                    loader: require.resolve("./testLoader"),
                },
                {
                    loader: 'html-loader',
                    options: {
                        esModule: false,
                        minimize: false,
                    },
                },
                {
                    loader: path.resolve(__dirname, "../../index.js"),
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
                            require.resolve(
                                'san-hot-loader/lib/babel-plugin'
                            ),
                        ],
                        presets: [
                            [
                                require.resolve('@babel/preset-env'),
                                {
                                    targets: {
                                        browsers: '> 1%, last 2 versions',
                                    },
                                    modules: false,
                                },
                            ],
                        ],
                    },
                },
                // {
                //     loader: path.resolve(__dirname, "../../index.js"),
                //     options: loaderOptions || {},
                // },
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
                                    localIdentName:
                                        '[local]_[hash:base64:5]',
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
                                    localIdentName:
                                        '[local]_[hash:base64:5]',
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
      ],
    },
    resolve: {
        extensions: ['.js', '.san']
    },
    plugins: [
        new SanLoaderPlugin()
    ],
    ...config,
  };
  
  const compiler = webpack(fullConfig);

  const webpackFs = ensureWebpackMemoryFs(fs)
  compiler.outputFileSystem = webpackFs
  compiler.resolvers.context.fileSystem = webpackFs

  return compiler;
};
