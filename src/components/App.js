import React from 'react';
import "./app.scss";

// components
import Map from "./Map";
import Footer from "./Footer";

// data
import LOAN_DATA from "../data/foia_150k_plus.json";

// utils
import usePivotData from "../utils/usePivotData";

const App = () => {
	const [data, dataReference] = usePivotData(LOAN_DATA, "Zip"); 

	return (
		<div className="app">
			<header>
				<h1>COVID-19 SBA Loans</h1>
				<h2>Hawaii zip code distribution for loans $150k+</h2>
			</header>
			<div>
				{data && <Map data={data} dataReference={dataReference} />}
			</div>
			<Footer />
		</div>
	)
};

export default App;
