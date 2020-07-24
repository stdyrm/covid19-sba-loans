const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");

module.exports = {
	entry: "./src/index.js",
	output: {
		path: path.join(__dirname, "/dist"),
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: [/node_modules/, /server/, /raw-data/],
				use: ["babel-loader", "eslint-loader"]
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					"style-loader",
					"css-loader",
					"sass-loader"
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf|csv)$/,
				use: [
					"file-loader"
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new ManifestPlugin(),
		new HtmlWebpackPlugin({
			template: "./src/index.html"
		})
	]
};