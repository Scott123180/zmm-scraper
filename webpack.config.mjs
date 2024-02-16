import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import nodeExternals from 'webpack-node-externals';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';


const __dirname = dirname(fileURLToPath(import.meta.url));

const webpackConfig = {
    entry: './src/index.mjs',
    plugins: [
        //deletes the old output before generating new
        new CleanWebpackPlugin(),
    ],
    output: {
        filename: 'index.js',
        path: resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs2', // Specify module type for ESM support
        chunkFormat: 'module', // Explicitly set chunk format to 'module'
    },
    // Resolve .mjs files.
    resolve: {
        extensions: ['.mjs', '.js'],
    },
    // Enable handling of ES modules by setting the 'experiments' field.
    experiments: {
        outputModule: true,
    },
    // Target environment for the bundle.
    target: "node20",
    // Do not include any of the built-in modules in Node.js (e.g., fs, path) in the bundle.
    externalsPresets: { node: true },
    // Do not bundle node_modules dependencies. This can reduce the bundle size
    // and avoid issues with native dependencies.
    externals: [nodeExternals({
        allowlist: [
            'axios',
            'cheerio',
            "@aws-sdk/client-ses",
            "@aws-sdk/client-s3"
        ]
    })],
    module: {
        rules: [
            {
                test: /\.mjs$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    optimization: {
        usedExports: true,
    },
    mode: 'production',
};

export default webpackConfig;
