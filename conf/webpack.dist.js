const fs = require('fs');
const path = require('path');
require('graceful-fs').gracefulify(fs);

const ROOT = path.resolve('.');

module.exports = {
    mode : "production",
    watch: false,
    stats: { colors: true, reasons: true },

    output: {
        path : path.resolve('dist'),
        filename: '[name].min.js',
        chunkFilename: '[id].chunk.js'
    },

    entry: {
        'beyond-grammar-plugin' : "expose-loader?BeyondGrammarCKEditor!./src/beyond-grammar-ckeditor-plugin.ts"
    },

    resolve: {
        extensions: [ '.ts', '.es6', '.js', '.json' ],
        modules: [
            path.join(ROOT, 'node_modules'),
            'node_modules'
        ]
    },
    
    module: {
        rules: [
            {test: /\.ts$/, loader: 'ts-loader'}
        ]
    }
};

