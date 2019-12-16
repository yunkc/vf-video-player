const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    output: {
        path: __dirname + "/dist",
        publicPath: 'dist',
        filename: 'VFMediaPlayer.js',
        library: 'VFMediaPlayer', // 指定类库名,主要用于直接引用的方式(比如使用script 标签)
        libraryExport: 'default', // 对外暴露default属性，就可以直接调用default里的属性
        globalObject: 'this', // 定义全局变量,兼容node和浏览器运行，避免出现"window is not defined"的情况
        libraryTarget: 'umd', // 定义打包方式Universal Module Definition,同时支持在CommonJS、AMD和全局变量使用
        umdNamedDefine: true
    },

    /* entry: "./src/test/test01.ts",
    output: {
        path: __dirname + "/dist",
        filename: 'test.js',
    }, */

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

            { test: /\.(png|jpg|gif|txt)$/, loader: 'file-loader' },
        ]
    },

    plugins: [
        // new BundleAnalyzerPlugin()
    ]
};