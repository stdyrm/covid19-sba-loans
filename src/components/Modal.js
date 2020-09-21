import React from 'react';
import PropTypes from "prop-types";
import { useTransition, animated } from "react-spring";
import ZIPCODES from "../reference/zip-codes-wpr.json";
import "./modal.scss";

const Modal = ({ activeModal, setActiveModal }) => {
	const transitions = useTransition(activeModal, null, {
		from: { position: "absolute", opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0, width: 0 }
	});

	return (
		<div>
			{transitions.map(({ item, key, props }) => {
				return item
					&& <animated.div
						className="modal-wrapper"
						key={key}
						style={props}
						onClick={() => setActiveModal(null)}
					>
						<div className = "modal">
							<h3 className="modal-title">{activeModal}</h3>
							{ZIPCODES.filter(d => d.zip.toString() === activeModal)[0]
								&& <div>
										<p>{ZIPCODES.filter(d => d.zip.toString() === activeModal)[0].city}</p>
										<p>{ZIPCODES.filter(d => d.zip.toString() === activeModal)[0].county} County</p>
									</div>								
							}
						</div>
					</animated.div>
			})
			}
		</div>
	);
};

export default Modal;

Modal.propTypes = {
	activeModal: PropTypes.string,
	setActiveModal: PropTypes.func
};
