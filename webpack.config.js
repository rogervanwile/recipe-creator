const defaultConfig = require("./node_modules/@wordpress/scripts/config/webpack.config.js");

const path = require("path");

module.exports = {
  ...defaultConfig,
  entry: {
    "pinterest-image-overlay": path.resolve(
      process.cwd(),
      "src",
      "ts",
      "pinterest-image-overlay.ts"
    ),
    frontend: path.resolve(process.cwd(), "src", "ts", "frontend.ts"),
    editor: path.resolve(process.cwd(), "src", "editor.js"),
  },
  module: {
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
