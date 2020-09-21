import React, { useState, useEffect, useReducer } from 'react';
import "./app.scss";

// components
import Map from "./Map";
import { SelectParams, SelectIndicator } from "./pickers";

// utils
import { usePivotData } from "../utils";

const indicatorReducer = (state, action) => {
	switch (action.type) {
		case "numLoans":
			return { value: action.type, label: "Num. loans (total)", units: "loans total" };
		case "numLoansPerCapita":
			return { value: action.type, label: "Num. loans (per 1000 people)", units: "loans/1000" };
		case "jobsRetained": 
			return { value: action.type, label: "Jobs retained (total)", units: "jobs total" };
		case "jobsRetainedPerCapita": 
			return { value: action.type, label: "Jobs retained (per 1000 people)", units: "jobs/1000" };
		case "totAmountUnder150K": 
			return { value: action.type, label: "Tot. amount in loans under $150k", units: "USD" };
		default:
			throw new Error();
	};
};

const App = () => {
	const [dataOver150K, dataAll] = usePivotData("zip");
	const [selected, setSelected] = useState({
		value: "all-loans",
		label: "all loans"
	});
	const [indicator, dispatchIndicator] = useReducer(indicatorReducer, {
		value: "numLoans",
		label: "Num. loans (total)",
		units: "loans total"
	});
	
	return (
		<div className="app">
			<header className="app-toolbar">
				<div className="app-toolbar-title">
					<h1>SBA PPP Loan Distribution in Hawaii</h1>
					<h3>Hawaii zip code distribution for {selected.label} (as of 6/30/20)</h3>
				</div>
				<div className="app-toolbar-selectors">
					<SelectParams selected={selected} setSelected={setSelected} />
					<SelectIndicator dispatchIndicator={dispatchIndicator} />
				</div>
			</header>
			<div>
				{dataAll && <Map dataOver150K={dataOver150K} dataAll={dataAll} selected={selected} indicator={indicator} />}
			</div>
			<footer className="app-footer">
				<h1>About this Chart</h1>
				<hr/>
				<p>
					Loan data:&nbsp;
					<a
						href="https://home.treasury.gov/policy-issues/cares-act/assistance-for-small-businesses/sba-paycheck-protection-program-loan-level-data"
						rel="noreferrer noopener"
						target="_blank"
					>
						U.S. Department of the Treasury
					</a>
				</p>
				<p>
					Map data:&nbsp;
					<a
						href="https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.2017.html"
						rel="noreferrer noopener"
						target="_blank"
					>
						U.S. Census Bureau
					</a>
				</p>
				<p>
					Hawaii population reference:&nbsp; 
					<a
						href="https://dbedt.hawaii.gov/economic/databook/2018-individual/_01/"
						rel="noreferrer noopener"
						target="_blank"
					>
						State of Hawaii Department of Business, Economic Development, and Tourism
					</a>
				</p>
				<p>
					Zip code reference:&nbsp; 
					<a
						href="https://worldpopulationreview.com/zips/hawaii"
						rel="noreferrer noopener"
						target="_blank"
					>
						World Population Review
					</a>
				</p>
				<p>*Zip codes provided by U.S. Census Bureau may not be 100% consistent with USPS zip codes. Some regions on the map do not contain zip codes.</p>
				<p>*Because of this, it is possible some zip codes that received loans are not reflected on the map.
					Visit the&nbsp;
					<a href="https://www.census.gov/programs-surveys/geography/guidance/geo-areas/zctas.html">U.S. Census Bureau website</a>
					&nbsp;to see their methodology on calculating Zip Code Tabulation Areas.
				</p>
			</footer>
		</div>
	)
};

export default App;
