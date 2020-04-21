const fs = require('fs');
const path = require('path');
require('graceful-fs').gracefulify(fs);
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    ...require("./webpack.dist.js"),
    ...{
        watch : true,
        mode : "development",
        output: {
            path : path.resolve('dist'),
            filename: '[name].js',
            chunkFilename: '[id].chunk.js'
        },
        plugins: [
            new CopyWebpackPlugin([
                { from: './src/ckeditor.html', to: './' }
            ])
        ]
    }
}