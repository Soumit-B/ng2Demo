const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const VersionFile = require('webpack-version-file-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const GlobalizePlugin = require( "globalize-webpack-plugin" );
const versionPath = path.join(__dirname);
const locales = require('./config/globalize/locale.json').localeCultureList;

//=========================================================
//  VARS
//---------------------------------------------------------
const NODE_ENV = process.env.NODE_ENV;
const ENV_DEVELOPMENT = NODE_ENV === 'DEV';
const ENV_PRODUCTION = (NODE_ENV === 'PROD' || NODE_ENV === 'PRODLIVE');
const ENV_TEST = NODE_ENV === 'QA';
const ENV_BACKUP = NODE_ENV === 'BACKUP';
const HOST = '0.0.0.0';
const PORT = 3000;

// console.log(process.env.NODE_ENV);
// Cannot require dynamic path with AOT
// API
if (NODE_ENV === null) {
    NODE_ENV = 'PROD';
}
const apiDetails = require('./config/' + NODE_ENV.toLowerCase() + '.config');
const supportedLocales = []/*[ 'ar', 'de', 'en', 'es', 'pt', 'ru', 'zh' ]*/;


var processObj = apiDetails.appConfig().urls;
processObj['process.env.LOCALES'] = JSON.stringify(JSON.stringify(locales));

//=========================================================
//  LOADERS
//---------------------------------------------------------
const loaders = {
    componentStyles: {
        test: /\.scss$/,
        loader: 'raw!postcss!sass',
        exclude: path.resolve('src/shared/styles')
    },
    sharedStyles: {
        test: /\.scss$/,
        loader: 'style!css!postcss!sass',
        include: path.resolve('src/shared/styles')
    },
    sharedStylesExtracted: {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css?-autoprefixer!postcss!sass'),
        include: path.resolve('src/shared/styles')
    },
    html: {
        test: /\.html$/,
        loader: 'raw'
    },
    typescript: {
        test: /\.ts$/,
        loader: ['ts-loader?' + JSON.stringify({
            transpileOnly: true,
            configFileName: 'tsconfig.aot.build.json'
        }), 'angular2-router-loader?aot=true&genDir=aot/src']
    },
    image: {
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader'
    }
};

var clrArray = [];
for (var i = 0; i < locales.length; i++) {
    clrArray.push({ from: 'node_modules/cldr-data/main/' + locales[i].globalizeLocaleCode, to: 'i18n/cldr-data/main/' + locales[i].globalizeLocaleCode });
    clrArray.push({ from: './src/i18n/cultures/' + 'globalize.culture.' + locales[i].globalizeParserLocaleCode + '.js', to: 'i18n/cultures/' });
    clrArray.push({ from: './src/i18n/datejs/' + 'date-' + locales[i].dateLocaleCode + '.js', to: 'i18n/datejs/' });
    supportedLocales.push(locales[i].globalizeLocaleCode);
}
var copyArray = [
    { from: './src/shared/assets', to: 'assets' },
    { from: './src/i18n/translations', to: 'i18n/translations' },
    { from: 'node_modules/cldr-data/supplemental', to: 'i18n/cldr-data/supplemental' }
];
copyArray = copyArray.concat(clrArray);
//=========================================================
//  CONFIG
//---------------------------------------------------------
const config = module.exports = {};

config.entry = {
    'main': './src/main.aot.ts',
    'search-internal': './aot/src/app/internal/search.module.ngfactory.ts',
    'shared': './aot/src/shared/shared.module.ngfactory.ts',
    'polyfills': './src/polyfills.ts',
    'vendor-globalize': [
        'globalize',
        'globalize/dist/globalize-runtime/number',
        'globalize/dist/globalize-runtime/currency',
        'globalize/dist/globalize-runtime/date',
        'globalize/dist/globalize-runtime/message',
        'globalize/dist/globalize-runtime/plural',
        'globalize/dist/globalize-runtime/relative-time',
        'globalize/dist/globalize-runtime/unit'
    ]
};


config.output = {
    path: path.resolve('./target'),
    publicPath: '/'
};

config.output.filename = '[name].[chunkhash].js';
config.output.chunkFilename = '[name].[chunkhash].js';

config.resolve = {
    extensions: ['.ts', '.js'],
    mainFields: ['module', 'browser', 'main'],
    modules: [
        path.resolve('.'),
        'node_modules'
    ]
};

config.module = {
    loaders: [
        loaders.typescript,
        loaders.html,
        loaders.componentStyles,
        loaders.image,
        loaders.sharedStylesExtracted
    ],
    rules: []
};

config.plugins = [
    new DefinePlugin(processObj),
    new LoaderOptionsPlugin({
        debug: false,
        minimize: ENV_PRODUCTION
    }),
    new ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        path.resolve('src')
    ),
    new HtmlReplaceWebpackPlugin({
        pattern: 'GOOGLE_ANALYTICS_SECRET',
        replacement: process.env.GA_TRACK_CODE
    }),
    new CopyWebpackPlugin(copyArray),
    new HtmlWebpackPlugin({
        chunkSortMode: 'dependency',
        filename: 'index.html',
        hash: false,
        inject: 'body',
        template: './src/index.html'
    }),
    new webpack.NamedModulesPlugin(),
    new GlobalizePlugin({
        production: false,
        developmentLocale: 'en',
        supportedLocales: supportedLocales,
        output: "i18n/[locale].[hash].js"
    }),
    new CommonsChunkPlugin({
        name: ['search-internal', 'shared', 'polyfills', 'manifest'],
        minChunks: Infinity
    }),
    new ExtractTextPlugin('styles.[contenthash].css'),
    new UglifyJsPlugin({
        comments: false,
        compress: {
            dead_code: true, // eslint-disable-line camelcase
            screw_ie8: true, // eslint-disable-line camelcase
            unused: true,
            warnings: false,
            if_return: false
        },
        mangle: {
            screw_ie8: true // eslint-disable-line camelcase
        },
        sourceMap: false
    }),
    new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
    }),
    new VersionFile({
        packageFile: path.join(__dirname, 'package.json'),
        template: path.join(__dirname, 'version.ejs'),
        outputFile: path.join(versionPath, 'version.json')
    })
];

config.postcss = [
    autoprefixer({ browsers: ['last 3 versions'] })
];

config.sassLoader = {
    outputStyle: 'compressed',
    precision: 10,
    sourceComments: false
};

config.tslint = {
    typeCheck: false,
    failOnHint: false,
    configFile: './tslint.json',
    fileOutput: {
        dir: './report/',
        ext: 'log',
        clean: true,
        header: 'TSLint -'
    }
};