const webpack = require('webpack');

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer"),
        "vm": require.resolve("vm-browserify"),
    });
    config.resolve.fallback = fallback;

    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser.js',
            Buffer: ['buffer', 'Buffer']
        })
    ]);

    config.resolve.alias = {
        ...config.resolve.alias,
        "process/browser": "process/browser.js"
    };

    config.ignoreWarnings = [/Failed to parse source map/];

    return config;
};
