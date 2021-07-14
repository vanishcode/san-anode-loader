import path from 'path';

import webpack from 'webpack';
import fs from 'memfs';
import SanLoaderPlugin from 'san-loader/lib/plugin';
import joinPath from 'memory-fs/lib/join';

import originRules from './moduleRules';

function ensureWebpackMemoryFs(fs) {
    if (fs.join) {
        return fs;
    }
    // 处理 join 不存在的问题。。
    const nextFs = Object.create(fs);
    nextFs.join = joinPath;
    return nextFs;
}

export default (fixture, loaderOptions = {}, config = {}) => {
    // 动态更改 webpack 配置
    let rules = originRules(loaderOptions);
    if (loaderOptions.testType === 'injs') {
        rules[1].use.splice(0, 1);
        rules[2].use.splice(0, 1);

        rules[3].use.unshift({
            loader: require.resolve('./testLoader'),
        });
        rules[3].use.push({
            loader: path.resolve(__dirname, '../../index.js'),
            options: loaderOptions || {},
        });
    }

    const fullConfig = {
        mode: 'development',
        devtool: config.devtool || false,
        context: path.resolve(__dirname, '../fixtures'),
        entry: path.resolve(__dirname, '../fixtures', fixture),
        output: {
            path: path.resolve(__dirname, '../outputs'),
            filename: '[name].bundle.js',
            chunkFilename: '[name].chunk.js',
        },
        module: {
            rules,
        },
        resolve: {
            extensions: ['.js', '.san'],
        },
        plugins: [new SanLoaderPlugin()],
        ...config,
    };

    const compiler = webpack(fullConfig);

    const webpackFs = ensureWebpackMemoryFs(fs);
    compiler.outputFileSystem = webpackFs;
    compiler.resolvers.context.fileSystem = webpackFs;

    return compiler;
};
