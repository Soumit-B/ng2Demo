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
const GlobalizePlugin = require("globalize-webpack-plugin");
const versionPath = path.join(__dirname);
const locales = require('./config/globalize/locale.json').localeCultureList;

//=========================================================
//  VARS
//---------------------------------------------------------
const NODE_ENV = process.env.NODE_ENV;

const ENV_DEVELOPMENT = NODE_ENV === 'DEV';
const ENV_PRODUCTION = NODE_ENV === 'PROD';
const ENV_PRODUCTION_LIVE = NODE_ENV === 'PRODLIVE';
const ENV_TEST = NODE_ENV === 'QA';
const ENV_BACKUP = NODE_ENV === 'BACKUP';
const ENV_DEVONQA = NODE_ENV === 'DEVONQA';
const ENV_DEVONSG = NODE_ENV === 'DEVONSG';

const HOST = '0.0.0.0';
const PORT = 3000;

// API
if (NODE_ENV === null) {
    NODE_ENV = 'PROD';
}
const apiDetails = require('./config/' + NODE_ENV.toLowerCase() + '.config');
console.log('./config/' + NODE_ENV.toLowerCase() + '.config');

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
        loader: ['ts?' + JSON.stringify({ transpileOnly: true }), 'angular2-template-loader', 'angular2-router-loader']

    },
    image: {
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader'
    }
};


//=========================================================
//  CONFIG
//---------------------------------------------------------
const config = module.exports = {};

config.resolve = {
    extensions: ['.ts', '.js'],
    mainFields: ['module', 'browser', 'main'],
    modules: [
        path.resolve('.'),
        'node_modules'
    ]
};

config.module = {
    /*preLoaders: [{
        test: /\.ts$/,
        loader: 'tslint-loader'
    }],*/
    loaders: [
        loaders.typescript,
        loaders.html,
        loaders.componentStyles,
        loaders.image
    ],
    rules: []
};

config.plugins = [
    new DefinePlugin(processObj),
    new LoaderOptionsPlugin({
        debug: false,
        minimize: (ENV_PRODUCTION || ENV_PRODUCTION_LIVE)
    }),
    new ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        path.resolve('src')
    ),
    new HtmlReplaceWebpackPlugin({
        pattern: 'GOOGLE_ANALYTICS_SECRET',
        replacement: process.env.GA_TRACK_CODE
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

//=====================================
//  DEVELOPMENT or PRODUCTION
//-------------------------------------
if (ENV_DEVELOPMENT || ENV_DEVONQA || ENV_DEVONSG) {
    config.output = {
        path: path.resolve('./target'),
        publicPath: '/'
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
    config.plugins.push(
        new CopyWebpackPlugin(copyArray),
        new HtmlWebpackPlugin({
            chunkSortMode: 'dependency',
            filename: 'index.html',
            hash: false,
            inject: 'body',
            template: './src/index.html'
        })
    );
}
if (ENV_PRODUCTION || ENV_BACKUP || ENV_TEST || ENV_PRODUCTION_LIVE) {

    config.output = {
        path: path.resolve('./target'),
        publicPath: '/'
    };
    var clrArray = [];
    for (var i = 0; i < locales.length; i++) {
        //clrArray.push({ from: 'node_modules/cldr-data/main/' + locales[i].globalizeLocaleCode, to: 'i18n/cldr-data/main/' + locales[i].globalizeLocaleCode });
        // clrArray.push({ from: './src/i18n/cultures/' + 'globalize.culture.' + locales[i].globalizeParserLocaleCode + '.js', to: 'i18n/cultures/' });
        //clrArray.push({ from: './src/i18n/datejs/' + 'date-' + locales[i].dateLocaleCode + '.js', to: 'i18n/datejs/' });
        supportedLocales.push(locales[i].globalizeLocaleCode);
    }
    var copyArray = [
        { from: './src/shared/assets', to: 'assets' },
        { from: './src/i18n/translations', to: 'i18n/translations' }
        //{ from: 'node_modules/cldr-data/supplemental', to: 'i18n/cldr-data/supplemental' }
    ];
    copyArray = copyArray.concat(clrArray);
    config.plugins.push(
        new CopyWebpackPlugin(copyArray),
        new HtmlWebpackPlugin({
            chunkSortMode: 'dependency',
            filename: 'index.html',
            hash: false,
            inject: 'body',
            template: './src/index.html'
        })
    );
}


//=====================================
//  DEVELOPMENT(DEV/DEVONQA/DEVONSG/BACKUP)
//-------------------------------------
if (ENV_DEVELOPMENT || ENV_BACKUP || ENV_DEVONQA || ENV_DEVONSG) {
    config.entry = {
        'main': './src/main.ts',
        'search-internal': './src/app/internal/search.module.ts',
        'shared': './src/shared/shared.module.ts',
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts'
    };
    config.devtool = 'cheap-module-source-map';

    config.output.filename = '[name].js';
    config.output.chunkFilename = '[id].chunk.js';

    // config.module.loaders.push(loaders.typescript);
    config.module.loaders.push(loaders.sharedStyles);

    config.plugins.push(new ProgressPlugin(),
        new GlobalizePlugin({
            production: false,
            developmentLocale: 'de',
            supportedLocales: supportedLocales,
            output: "i18n/[locale].[hash].js"
        }),
        new CommonsChunkPlugin({
            name: ['search-internal', 'shared', 'vendor', 'polyfills', 'manifest'],
            minChunks: Infinity
        }),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
    );

    config.devServer = {
        contentBase: './src',
        historyApiFallback: true,
        host: HOST,
        port: PORT,
        stats: {
            cached: true,
            cachedAssets: true,
            chunks: true,
            chunkModules: false,
            colors: true,
            hash: false,
            reasons: true,
            timings: true,
            version: false
        }
    };
}


//=====================================
//  SIT/STAGE/PRODUCTION
//-------------------------------------
if (ENV_PRODUCTION || ENV_PRODUCTION_LIVE) {
    /*config.module.preLoaders = [{
        test: /\.ts$/,
        loader: 'strip-loader?strip[]=console.log'
    }];*/
    /*config.plugins.push(new HtmlReplaceWebpackPlugin({
        pattern: 'JIRA',
        replacement: process.env.JIRA
    }));*/
}
if (ENV_PRODUCTION || ENV_TEST || ENV_PRODUCTION_LIVE) {
    /*config.module.preLoaders = [{
        test: /\.ts$/,
        loader: 'strip-loader?strip[]=console.log'
    }];*/
    config.entry = {
        'main': './src/main.ts',
        'search-internal': './src/app/internal/search.module.ts',
        'shared': './src/shared/shared.module.ts',
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts',
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
    config.devtool = 'source-map';

    config.output.filename = '[name].[chunkhash].js';
    config.output.chunkFilename = '[name].[chunkhash].js';

    /* config.module.loaders.push(loaders.typescriptAOT);*/
    config.module.loaders.push(loaders.sharedStylesExtracted);

    config.plugins.push(
        new webpack.NamedModulesPlugin(),
        new GlobalizePlugin({
            production: false,
            developmentLocale: 'en',
            supportedLocales: supportedLocales,
            output: "i18n/[locale].[hash].js"
        }),
        new CommonsChunkPlugin({
            name: ['search-internal', 'shared', 'vendor', 'polyfills', 'manifest'],
            minChunks: Infinity
        }),
        new ExtractTextPlugin('styles.[contenthash].css'),
        new UglifyJsPlugin({
            comments: false,
            compress: {
                dead_code: true, // eslint-disable-line camelcase
                screw_ie8: true, // eslint-disable-line camelcase
                unused: true,
                warnings: false
            },
            sourceMap: false,
            mangle: {
                screw_ie8: true // eslint-disable-line camelcase
            }
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
    );
}
