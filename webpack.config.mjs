import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const __dirname = dirname(fileURLToPath(import.meta.url));

const webpackConfig = {
    entry: './src/index.mjs',
    plugins: [
        //deletes the old output before generating new
        new CleanWebpackPlugin(),
    ],
    output: {
        filename: 'index.mjs',
        path: resolve(__dirname, 'dist'),
        chunkFormat: 'module', // Explicitly set chunk format to 'module'
        library: {
            type : 'module',
        },
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
