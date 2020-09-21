import { useEffect, useState } from "react";
import { nest } from "d3";
import axios from "axios";
import environment from "../environment/environment";

// reference
import DATA_VALIDATION from "../data/zipCodeCounts.json";
import ZIPCODES from "../data/zipcode-population.json";

const LOAN_URL = environment.loans;

const getApi = async (url) => {
	console.log("Retrieving loans ...");
	const loanData = await axios.get(url)
		.catch(err => console.log(err));
	return loanData.data;
};

const usePivotData = (pivotBy="zip") => {
	const [dataOver150K, setDataOver150K] = useState(null);
	const [dataAll, setDataAll] = useState(null);

	useEffect(() => {
		getApi(LOAN_URL)
			.then(res => {
				const over150KNested = nest()
					.key(d => d[pivotBy])
					.entries(res.filter(d => d.loanAmount === "$150K+"));
				let refOver150K = {};
				over150KNested.forEach(d => {
					d.numLoans = d.values.length;
					refOver150K[d.key] = {
						values: d.values,
						numLoans: d.values.length,
						numLoansPerCapita: ZIPCODES[d.key]
							? Math.round(d.values.length / ZIPCODES[d.key].population * 10000) / 10
							: "No data",
						jobsRetained: d.values.reduce((acc, curr) => acc + curr.jobsRetained, 0),
						jobsRetainedPerCapita: ZIPCODES[d.key]
							? Math.round(d.values.reduce((acc, curr) => acc + curr.jobsRetained, 0) / ZIPCODES[d.key].population * 10000) / 10
							: "No data",
						totAmountUnder150K: Math.round(d.values.reduce((acc, curr) => typeof curr.loanAmount === "number" ? acc + curr.loanAmount : acc + 0, 0))
					};
				});
				
				const nestedData = nest()
					.key(d => d[pivotBy])
					.entries(res);
				let refAll = {};
				let discrepancies = {};
				nestedData.forEach(d => {
					d.numLoans = d.values.length;
					if (d.values.length !== DATA_VALIDATION[d.key]) {
						discrepancies[d.key] = {
							data: d.values.length,
							dataValidator: DATA_VALIDATION[d.key]
						}
					} 
					refAll[d.key] = {
						population: ZIPCODES[d.key] ? ZIPCODES[d.key].population : "No data",
						values: d.values,
						numLoans: d.values.length,
						numLoansPerCapita: ZIPCODES[d.key]
							? Math.round(d.values.length / ZIPCODES[d.key].population * 10000) / 10
							: "No data",
						jobsRetained: d.values.reduce((acc, curr) => acc + curr.jobsRetained, 0), 
						jobsRetainedPerCapita: ZIPCODES[d.key]
							? Math.round(d.values.reduce((acc, curr) => acc + curr.jobsRetained, 0) / ZIPCODES[d.key].population * 10000) / 10
							: "No data",
						totAmountUnder150K: Math.round(d.values.reduce((acc, curr) => typeof curr.loanAmount === "number" ? acc + curr.loanAmount : acc + 0, 0))
					};
				});
				if (Object.keys(discrepancies).length >  0) {
					console.error(new Error(`These ZIP CODES have discrepancies: 
						\n${Object.keys(discrepancies)}`));
				}
				return [refOver150K, refAll];
			})
			.then(res => {
				setDataOver150K(res[0]);
				setDataAll(res[1]);
			})
			.catch(err => console.log(err));
	}, []);

	return [dataOver150K, dataAll];
};

export default usePivotData;
