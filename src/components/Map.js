import React, { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";
import "./map.scss";

import PropTypes from "prop-types";

// components
import Modal from "./Modal";

// reference
import PARAMS from "../reference/PARAMS_MAP";
import hawaiiFeatureCollection from "../data/hawaii-feature-collection.json";

const { width, height } = PARAMS.chart.dimensions;

const Map = ({ dataOver150K, dataAll, selected, indicator }) => {
	const [activeModal, setActiveModal] = useState(null);
	const svgRef = useRef(null);

	useEffect(() => {
		const svg = d3.select(svgRef.current);

		let data;
		let logScale = d3.scaleLog();
		let colorScale = d3.scaleSequential(d => d3.interpolateYlOrBr(logScale(d)));
		let max;

		if (selected.value === "all-loans") { 
			data = dataAll;
			max = d3.max(Object.values(data), d => d[indicator.value]);
			logScale.domain([1, max]);
		
		} else if (selected.value === "loans-over-150k") {
			data = dataOver150K;
			max = d3.max(Object.values(data), d => d[indicator.value]);
			logScale.domain([1, max]);
		};

		// tooltip
		let tooltip = d3.select("body")
			.append("div")
			.attr("class", "tooltip")
			.attr("id", "map-tooltip")
			.style("opacity", 0);
		
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

				if (!data[zip] || data[zip][indicator.value] === 0) {
					return "#789288";
				} else {
					const indicatorVal = data[zip][indicator.value];
					return colorScale(indicatorVal);
				}
			})
			.attr("stroke", "#394742")
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
						if (!data[zip]) {
							return `${z.properties.ZCTA5CE10}<br/>0 ${indicator.units}`; 
						} else if (indicator.value === "totAmountUnder150K") {
							return `${z.properties.ZCTA5CE10}<br/>$${data[zip][indicator.value].toLocaleString()} ${indicator.units}`
						} else {
							return `${z.properties.ZCTA5CE10}<br/>${data[zip][indicator.value].toLocaleString()} ${indicator.units}`
						}
					})
					.style("left", d => d3.event.pageX < width / 2 ? `${d3.event.pageX + 10}px` : `${d3.event.pageX - 60}px`)
					.style("top", `${d3.event.pageY + 24}px`)
			})
			.on("mouseout", z => {
				svg.selectAll(`#id-${z.properties.ZCTA5CE10}`)
					.attr("stroke", "#394742")
					.attr("stroke-width", ".2px")
					.style("opacity", 1)
				tooltip
					.style("opacity", 0)
					.style("left", 0)
					.style("top", 0)
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
		
		const defaultView = `${vx} ${vy} ${vw} ${vh}`;

		svg
			.attr("viewBox", defaultView)
			.attr("preserveAspectRatio", "xMidYMid meet")
			.call(d3.zoom()
				.on("zoom", () => {
					const transform = d3.event.transform;
					container.attr("transform", transform);
				})
		);
		
		return () => {
			container.selectAll("path").remove();
		}
	}, [dataOver150K, dataAll, selected, indicator]);

	return (
		<div className="map-page-wrapper">
			<div className="chart-wrapper">
				<svg
					ref={svgRef}
					height={height}
					width={width}
					// className="chart-wrapper"
					className="chart"
				>
				</svg>
				<Modal
					activeModal={activeModal}
					setActiveModal={setActiveModal}
				/>
			</div>
		</div>
	);
};

export default Map;

Map.propTypes = {
	dataOver150K: PropTypes.object.isRequired,
	dataAll: PropTypes.object.isRequired,
	selected: PropTypes.object.isRequired,
	indicator: PropTypes.object.isRequired
};
