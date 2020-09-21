const PARAMS = {
	page: {},
	chart: {
		dimensions: {
			width: window.innerWidth * .9,
			height: window.innerHeight * .5,
			margin: {
				top: 20,
				bottom: 40,
				left: 40,
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
