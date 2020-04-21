var fs = require('fs');
var gracefulFs = require('graceful-fs');
gracefulFs.gracefulify(fs);

var webpack = require('webpack'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    path = require('path');

const ROOT = path.resolve('.');

module.exports = {
    watch : true,
    stats: { colors: true, reasons: true },

    output: {
        path : path.resolve('dist'),
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    entry: {
        'beyond-grammar-plugin' : "expose-loader?BeyondGrammarCKEditor!./src/beyond-grammar-ckeditor-plugin.ts",
         //"i18n-en" : "expose?GrammarChecker_lang_en!./src/i18n/en.ts"
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: './src/ckeditor.html', to: './' },
            { context : './src', from: {glob : './icons/**/*'}, to:'./' }
        ])
    ],

    resolve: {
        extensions: [ '.ts', '.es6', '.js', '.json' ],
        modules: [
            path.join(ROOT, "modules"),
            path.join(ROOT, 'node_modules'),
            'node_modules'
        ]
    },
    module: {
        rules: [
            {test: /\.ts$/, loader: 'ts-loader'},
            {test : /\.png$/, loader : "url-loader"}
        ]
    },

    devServer: {
        contentBase: './',
        proxy: {
            "/api/v1": {
                target: "http://rtgrammarapi.azurewebsites.net/",
                changeOrigin: true
            },
            "/api/language": {
                target: "http://rtgrammarapi.azurewebsites.net/",
                changeOrigin: true
            }
        }
    }
};

