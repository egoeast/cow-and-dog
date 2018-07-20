const path = require('path');

module.exports = {
    mode: 'development',
    //mode: 'production',
    entry: './main.js',
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, 'dist')
    },
    watch: true

};