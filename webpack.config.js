const path = require("path");

module.exports = {
  entry: "./public/js/react-components/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public/js"),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
