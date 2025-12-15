const dev = process.env.NODE_ENV !== "production";
const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const plugins = [new FriendlyErrorsWebpackPlugin()];
var HtmlWebpackPlugin = require("html-webpack-plugin");

// if (!dev) {
//   plugins.push(
//     new webpack.optimize.OccurrenceOrderPlugin(),
//     new BundleAnalyzerPlugin({
//       analyzerMode: "static",
//       reportFilename: "webpack-report.html",
//       openAnalyzer: false,
//     })
//   );
// }

module.exports = {
  mode: dev ? "development" : "production",
  context: path.join(__dirname, "src"),
  node: { fs: "empty", child_process: "empty" },
  devtool: "inline-source-map",
  entry: {
    app: "app.js",
    lib: ["react", "react-dom", "babel-polyfill"],
  },
  resolve: {
    modules: [path.resolve("./src"), "node_modules"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].bundle.js",
  },
  devServer: {
    historyApiFallback: true,
    port: 8443,
    key: fs.readFileSync(__dirname + "/src/server/server.key", "utf8"),
    cert: fs.readFileSync(__dirname + "/src/server/server.crt", "utf8"),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
      {
        test: /.(png|gif|jpg|jpeg?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images/",
              publicPath:
                process.env.NODE_ENV === "production" ? "images/" : "/images", // override the default path
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
              publicPath:
                process.env.NODE_ENV === "production" ? "fonts/" : "/fonts",
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: false, //remove when prod
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: "initial",
          minChunks: Infinity,
          name: "lib",
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.ejs",
      title: "foo berry",
    }),
  ],
};
