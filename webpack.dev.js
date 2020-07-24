const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
	mode: "development",
	devtool: "inline-source-map",
	devServer: {
		proxy: {
			contentBase: "./dist",
			"/api": {
				target: "http://localhost:5000",
				changeOrigin: true
			}
		}
	}
});
