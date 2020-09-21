import React from "react";
import PropTypes from "prop-types";
import "./select-params.scss";

const SelectIndicator = ({ dispatchIndicator }) => {
	// omitting totAmountUnder150K for now ... since it excludes loans over 150k, not sure if it's a good metric

	return (
		<div>
    	<label htmlFor="params">Indicator</label><br />
      <select name="target-attribute" className="select-params" onChange={e => dispatchIndicator({type: e.target.value})}>
				<option value="numLoans">Num. loans (total)</option>
				<option value="numLoansPerCapita">Num. loans (per 1000 people in zip code)</option>
				<option value="jobsRetained">Jobs retained (total)</option>
				<option value="jobsRetainedPerCapita">Jobs retained (per 1000 people in zip code)</option>
				{/* <option value="totAmountUnder150K">Tot. amount in loans under $150K (USD)</option> */}
			</select>
		</div>
  );
};

export default SelectIndicator;

SelectIndicator.propTypes = {
	dispatchIndicator: PropTypes.func
}
