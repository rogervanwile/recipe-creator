const defaultConfig = require('./node_modules/@wordpress/scripts/config/webpack.config.js');

const path = require('path');

module.exports = {
  ...defaultConfig,
  entry: {
    'pinterest-image-overlay': './src/ts/pinterest-image-overlay.ts',
    editor: path.resolve(process.cwd(), 'src', 'editor.js'),
    frontend: path.resolve(process.cwd(), 'src', 'frontend.js'),
  },
  module: {
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
