const defaultConfig = require("@wordpress/scripts/config/webpack.config.js");

const path = require("path");

module.exports = {
  ...defaultConfig,
  entry: {
    ...defaultConfig.entry(),
    admin: path.resolve(process.cwd(), "src/ts/admin.ts"),
  },

  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /\.hbs$/,
        use: {
          loader: "handlebars-loader",
        },
      },
    ],
  },
};
