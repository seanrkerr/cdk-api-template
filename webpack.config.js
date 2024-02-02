const glob = require("glob");
const { basename, resolve } = require("path");
const webpack = require("webpack");
const awsExternals = require("webpack-aws-externals");
const ZipPlugin = require("zip-webpack-plugin");

const entries = glob
  .sync(`${resolve(__dirname, "src")}/**/*.lambda.ts`)
  .map((file) => ({
    name: basename(file, ".lambda.ts"),
    path: file,
  }));

console.log("entries", entries);

module.exports = {
  entry: entries.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.name]: cur.path,
    }),
    {}
  ),
  externals: [awsExternals()],
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              onlyCompileBundledFiles: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  performance: {
    hints: false,
  },
  plugins: [
    ...entries.map(
      (x) =>
        new ZipPlugin({
          path: process.env.PACKAGE_DIRECTORY,
          filename: x.name,
          include: `${x.name}.js`,
        })
    ),
  ],
  optimization: {
    minimize: false,
  },
  output: {
    filename: "[name].js",
    path: process.env.BUILD_DIRECTORY,
    libraryTarget: "commonjs2",
  },
  target: "node",
};
