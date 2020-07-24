import React, { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";
import "./map.scss";

import PropTypes from "prop-types";

// components
import Modal from "./Modal";

// reference
import PARAMS from "../reference/PARAMS_MAP";
import hawaiiFeatureCollection from "../data/hawaii-feature-collection.json";

const { width, height, margin } = PARAMS.chart.dimensions;

const Map = ({ data, dataReference }) => {
	const [activeModal, setActiveModal] = useState(null);
	
	const svgRef = useRef(null);

	useEffect(() => {
		const svg = d3.select(svgRef.current);

		// tooltip
		let tooltip = d3.select("body")
			.append("div")
			.attr("class", "tooltip")
			.attr("id", "map-tooltip")
			.style("opacity", 0);
		
		// axis scales
		const colorScale = d3.scaleThreshold()
			.domain([1, 2, 3, 6, 9, 15])
			.range(d3.schemeGreens[7]);

		// responsive map dimensions
		const projection = d3.geoAlbersUsa();
		const path = d3.geoPath()
			.projection(projection);

		projection.scale(1).translate([0,0]);

		const b = path.bounds(hawaiiFeatureCollection);
		const s = 1 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
		const t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

		projection.scale(s).translate(t);

		const container = svg.append("g")
			.attr("id", "container")
			.attr("transform", "translate(0,0)scale(1,1)");
		
		const map = container.selectAll("path")
			.data(hawaiiFeatureCollection.features)
			.join("path")

		map	
			.style("fill", d => {
				const zip = d.properties.ZCTA5CE10;

				if (!dataReference[zip]) {
					return "#789288";
				} else {
					const loanQtyByZip = dataReference[zip].numLoans;
					return colorScale(loanQtyByZip);
				}
			})
			.attr("stroke", "#fff")
			.attr("stroke-width", ".2px")
			.attr("class", "map-region")
			.attr("id", d => `id-${d.properties.ZCTA5CE10}`)
			.attr("d", path)
			.on("mouseover", z => {
				svg.selectAll(`#id-${z.properties.ZCTA5CE10}`)
					.attr("stroke", "#CC4514")
					.attr("stroke-width", ".8px")
					.style("opacity", .8)
				tooltip.style("opacity", .9)
					.html(() => {
						const zip = z.properties.ZCTA5CE10;
						if (!dataReference[zip]) {
							return `${z.properties.ZCTA5CE10}<br/>0 loans`; 
						} else if (dataReference[zip].numLoans === 1) {
							return `${z.properties.ZCTA5CE10}<br/>${dataReference[zip].numLoans} loan`
						} else {
							return `${z.properties.ZCTA5CE10}<br/>${dataReference[zip].numLoans} loans`
						}
					})
					.style("left", d => d3.event.pageX < width / 2 ? `${d3.event.pageX + 10}px` : `${d3.event.pageX - 60}px`)
					.style("top", `${d3.event.pageY + 24}px`)
			})
			.on("mouseout", z => {
				svg.selectAll(`#id-${z.properties.ZCTA5CE10}`)
					.attr("stroke", "#fff")
					.attr("stroke-width", ".2px")
					.style("opacity", 1)
				tooltip.style("opacity", 0)
			})
			.on("click", z => {
				setActiveModal(z.properties.ZCTA5CE10);
			});
		
		// for zoom and drag functionality
		const bbox = container.node().getBBox();
		const vx = bbox.x;
		const vy = bbox.y;
		const vw = bbox.width;
		const vh = bbox.height;

		const defaultView = " " + vx + " " + vy + " " + vw + " " + vh;

		svg
			.attr("viewBox", defaultView)
			.attr("preserveAspectRatio", "xMidYMid meet")
			.call(d3.zoom()
				.on("zoom", () => {
					const transform = d3.event.transform;
					container.attr("transform", transform);
				})
			);
	}, []);

	return (
		<div className="map-page-wrapper">
				<svg
					ref={svgRef}
					height={height}
					width={width}
					className="chart-wrapper"
				>
				</svg>
				<Modal data={data} activeModal={activeModal} setActiveModal={setActiveModal} />
		</div>
	);
};

export default Map;

Map.propTypes = {
	data: PropTypes.arrayOf(PropTypes.object).isRequired,
	dataReference: PropTypes.object.isRequired
};
