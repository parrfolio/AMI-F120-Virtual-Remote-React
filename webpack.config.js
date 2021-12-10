const dev = process.env.NODE_ENV !== "production";
const webpack = require("webpack");
const path = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const plugins = [new FriendlyErrorsWebpackPlugin()];

if (!dev) {
  plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "webpack-report.html",
      openAnalyzer: false,
    })
  );
}

module.exports = {
  mode: dev ? "development" : "production",
  context: path.join(__dirname, "src"),
  node: { fs: "empty" },
  devtool: "inline-source-map",
  entry: {
    app: "./js/Index.js",
    lib: ["react", "react-dom", "babel-polyfill"],
  },
  resolve: {
    modules: [path.resolve("./src"), "node_modules"],
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
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].bundle.js",
    publicPath: "/",
  },
  devServer: {
    historyApiFallback: true,
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/js/Index.js",
      title: "",
    }),
  ],
  optimization: {
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
  plugins,
};
