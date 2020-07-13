const path = require("path");
const isDevelopment = process.env.NODE_ENV === "development";
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./src/index.js",
	devtool: "inline-source-map",
	devServer: {
		contentBase: "./dist"
	},
	output: {
		path: `${__dirname}/dist`,
		publicPath: "/",
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
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
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					"file-loader"
					]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve("./dist/index.html")
		})
	]
};