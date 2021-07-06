# san-anode-loader

`san-anode-loader` 是一个可以将 san 单文件组件或js中的模版部分编译为 aPack 或 aNode 形式的 webpack loader

合并了此项目：<https://github.com/luoyimaid/san-template-loader>

## 安装

使用 npm:

```bash
npm i san-anode-loader
```

使用 yarn:

```bash
yarn add san-anode-loader
```

## 使用

examples 中编写了一个最简单的、完整的项目示例。

下面是配置文件：

```js
{
    test: /\.pug$/,
    use: [
        {
            loader: "html-loader",
        },
        {
            loader: 'san-anode-loader',
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
            loader: 'san-anode-loader',
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
        {
            loader: 'san-anode-loader',
            options: {
                compileTemplate: 'aPack',
                mode: 'compact',
            },
        },
    ],
},
```

### 处理单文件组件

当使用如 pug 类的 html 模版时，确保先走模板的 loader 然后再走 san-anode-loader，因为 san-loader 不能编译不是标准 html 的代码片段。

### 处理 js 中的template

mode代表模式：

- 严格模式 strict

- 兼容模式 compact

严格模式下，template 不可以出现字符串表达式，否则会报错，兼容模式下，会跳过有字符串表达式的 template

## 注意事项

目前兼容到 webpack5，但因为 html-loader2 有兼容性问题，所以同样的项目配置在 5 中会有问题，请移步 [html-loader](https://github.com/webpack-contrib/html-loader) 讨论区

## 问题反馈

可移步 [san discussion](https://github.com/baidu/san/discussions) 讨论区

## License

MIT &copy; [vanishcode](https://github.com/vanishcode)

MIT &copy; [luoyimaid](https://github.com/luoyimaid)
