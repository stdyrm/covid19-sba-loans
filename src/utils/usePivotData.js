import { nest } from "d3";

const usePivotData = (data, pivotBy="Zip") => {
	// data=object, pivotBy=string
	// returns nestedData = pivot table using pivotBy as key to create visualizations
	// returns referenceData = nestedData as an object literal for easier reference

	const nestedData = nest()
		.key(d => d[pivotBy])
		.entries(data.rows);

	let referenceData = {};
	
	nestedData.forEach(zipCode => {
		zipCode.numLoans = zipCode.values.length;
		referenceData[zipCode.key] = {
			values: zipCode.values,
			numLoans: zipCode.values.length
		}
	});

	return [nestedData, referenceData];
};

export default usePivotData;
