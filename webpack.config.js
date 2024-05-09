const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/cli.ts",
  output: {
    filename: "index.js",
    path: path.join(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "swc-loader",
          options: {
            jsc: {
              target: "es2020",
              parser: {
                syntax: "typescript",
                tsx: false,
                dynamicImport: false,
                decorators: true,
                decoratorsBeforeExport: true,
              },
            },
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  target: "node",
  externals: {
    "@napi-rs/keyring": "commonjs @napi-rs/keyring",
    keytar: "commonjs keytar",
    "@azure/msal-node": "commonjs @azure/msal-node",
    "@azure/msal-node-extensions": "commonjs @azure/msal-node-extensions",
  },
};
