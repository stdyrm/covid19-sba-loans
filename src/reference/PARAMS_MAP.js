const PARAMS = {
	page: {},
	chart: {
		dimensions: {
			width: window.innerWidth * .9,
			height: window.innerHeight * .7,
			margin: {
				top: 20,
				bottom: 60,
				left: 60,
				right: 20
			}
		},
		x: {
			param: "Zip",
			paramFields: [
				"Zip",
				"JobsRetained",
			]
		},
		y: {},
		color: {
			param: "LoanRange"
		},
	},
};

export default PARAMS;
