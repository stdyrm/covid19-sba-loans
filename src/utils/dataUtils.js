import LOANS_U150K from "../data/PPP Data up to 150k - HI.csv";
import * as d3 from "d3";

	// notable values colorscale: LoanRange (> 150k), LoanAmount (< 150k), JobsRetained
	// attributes (map): Zip
	// attributes (for other charts): NonProfit, Gender, Veteran, RaceEthnicity, Lender, 
	// need to extract from JSON file: Lender (name), LoanRange (amount)

	// csv to JSON
	// clean data, extract values if need (ie, lender, loan range)
	// merge datasets -- <150k and >150k -- can filter using state
	// create pickers -- filter by different variables, select different values to show

	// create dashboard to show zip code details

const csvToJSON = (csv) => {
	return d3.csv(csv, d => {
		return {
			...d,
			DateApproved: new Date(d["DateApproved"]),
			JobsRetained: +d["JobsRetained"],
			LoanAmount: d["LoanAmount"] ? +d["LoanAmount"] : "Over $150K", // Only LoanRange provided for >150K, not exact amounts
			Under150K: d["LoanAmount"] ? "Y" : "N",
		}
	});
};

const mergeData = () => {

};

const extractReferenceData = (jsonFile, attributesToExtract) => {
	// extract reference data from JSON file (missing from CSV files). 
	// jsonFile = object, attributesToExtract = array
	// Lender (name), LoanRange (amount)
	let reference = {};

	jsonFile.rows.forEach(row => {
		attributesToExtract.forEach(attr => {
			reference[attr] = {
				...reference[attr],
				[row[attr].value]: row[attr].label
			};
		});
	});
	return reference;
};

const useReferenceData = () => {

};


export { csvToJSON };
