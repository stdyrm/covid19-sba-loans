import React, { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";
import * as topojson from "topojson-client";
import "./map.scss";

import PropTypes from "prop-types";

// components
import Modal from "./Modal";

// reference
import PARAMS from "../reference/PARAMS_MAP";
import USA from "../data/cb_2017_us_zcta510_500k.json";

const { width, height, margin } = PARAMS.chart.dimensions;

const Map = ({ data, dataReference }) => {
	const [activeModal, setActiveModal] = useState(null);
	
	const svgRef = useRef(null);
	const boundsRef = useRef(null);
	const xRef = useRef(null);
	const yRef = useRef(null);

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
			.range(d3.schemeBuGn[7])
		
		// clean map data
		const mapUsa = topojson.feature(USA, USA.objects.cb_2017_us_zcta510_500k);

		// filter Hawaii zip codes
		let hawaiiFeatureCollection = {
			type: "FeatureCollection",
			features: []
		};

		mapUsa.features.forEach(feat => {
			if (feat.properties.ZCTA5CE10.startsWith("967") || feat.properties.ZCTA5CE10.startsWith("968")) {
				hawaiiFeatureCollection.features.push(feat);
			}
		});

		// responsive map dimensions
		const projection = d3.geoAlbersUsa();
		const path = d3.geoPath()
			.projection(projection);

		projection.scale(1).translate([0,0]);

		const b = path.bounds(hawaiiFeatureCollection);
		const s = 1 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
		const t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

		projection.scale(s).translate(t);
		
		svg.selectAll("path")
			.data(hawaiiFeatureCollection.features)
			.join("path")
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
					.style("left", `${d3.event.pageX + 10}px`)
					.style("top", `${d3.event.pageY + 28}px`)
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
	}, []);

	return (
		<div className="map-root">
			<svg
				ref={svgRef}
				height={height}
				width={width}
				viewBox={`0 0 ${width} ${height}`}
				className="chart-wrapper"
			>
				<g ref={boundsRef}>
					<g ref={xRef} />
					<g ref={yRef} />
				</g>
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
