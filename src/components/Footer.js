import React from 'react';

const Footer = () => {
	return (
		<footer>
			<p>Loan data from https://sba-loans-covid-19.datasettes.com/</p>
			<p>Map data from U.S. Census Bureau https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.2017.html</p>
			<p>*Zip codes provided by U.S. Census Bureau may not be 100% consistent with USPS zip codes. Some zip codes are missing from the Census shapefile</p>
		</footer>
	)
};

export default Footer;
