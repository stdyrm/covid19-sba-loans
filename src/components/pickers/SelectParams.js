import React from "react";
import PropTypes from "prop-types";
import "./select-params.scss";

const SelectParams = ({ setSelected }) => {
	const handleSelected = (e) => {
		setSelected({
			value: e.target.value,
			label: e.target.value.replace(/-/g," ")
		});
	};

	return (
		<div>
    	<label htmlFor="params">Loan size grouping</label><br />
      <select name="target-attribute" className="select-params" onChange={handleSelected}>
				<option value="all-loans">All loans</option>
				<option value="loans-over-150k">$150K and above</option>
      </select>
		</div>
  );
};

export default SelectParams;

SelectParams.propTypes = {
	selected: PropTypes.object.isRequired,
	setSelected: PropTypes.func.isRequired
};
