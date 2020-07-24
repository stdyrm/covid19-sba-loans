import React, { useEffect } from 'react';
import "./app.scss";

// components
import Map from "./Map";

// data
import LOAN_DATA from "../data/foia_150k_plus.json";
// import LOAN_DATA_O150K from "../data/foia_150k_plus.csv";
// import LOAN_DATA_U150K from "../data/PPP Data up to 150k - HI.csv";

// utils
import usePivotData from "../utils/usePivotData";

const App = () => {
	const [data, dataReference] = usePivotData(LOAN_DATA, "Zip");

	return (
		<div className="app">
			<header className="app-toolbar">
				<div className="app-toolbar-contents">
					<h1>SBA PPP Loan Distribution in Hawaii</h1>
					<h3>Hawaii zip code distribution for loans $150k+ (as of 6/30/20)</h3>
				</div>
			</header>
			<div>
				{data && <Map data={data} dataReference={dataReference} />}
			</div>
			<footer className="app-footer">
				<h1>About this Chart</h1>
				<hr/>
				<p>
					Loan data:
					<a
						href="https://sba-loans-covid-19.datasettes.com/"
						rel="noreferrer noopener"
						target="_blank"
					>
						https://sba-loans-covid-19.datasettes.com/
					</a>
				</p>
				<p>
					Map data: 
					<a
						href="https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.2017.html"
						rel="noreferrer noopener"
						target="_blank"
					>
						https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.2017.html
					</a>
				</p>
				<p>*Zip codes provided by U.S. Census Bureau may not be 100% consistent with USPS zip codes. Some regions on the map do not contain zip codes.</p>
			</footer>
		</div>
	)
};

export default App;
