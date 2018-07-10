const path = require('path');

module.exports = {
    entry: './main.js',
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, 'dist')
    },
    watch: true

};