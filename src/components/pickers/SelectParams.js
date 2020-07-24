import React from "react";
import "./select-params.scss";

const SelectParams = () => {

  return (
    <label htmlFor="params">
      <select name="target-attribute" className="select-params">
				<option value="loans-o150k">Loans $150K and above</option>
				<option value="loans-u150k">Loans below $150K</option>
      </select>
    </label>
  );
};

export default SelectParams;