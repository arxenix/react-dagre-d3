var path = require('path');

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components|build)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"],
            }
        ]
    }
};