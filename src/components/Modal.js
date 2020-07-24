import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { useTransition, animated } from "react-spring";
import "./modal.scss";

const Modal = ({ data, activeModal }) => {
	const transitions = useTransition(activeModal, null, {
		from: { position: "absolute", opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 }
	});

	return (
		<div>
			{transitions.map(({ item, key, props }) => {
				return item
					&& <animated.div
						className="modal-wrapper"
						key={key}
						style={props}
					>
						<div className = "modal">
							<h3 className="modal-title">{activeModal}</h3>
							<p className="modal-contents">
								{!data.filter(d => d.key === activeModal)[0]
									? "0 loans"
									: data.filter(d => d.key === activeModal)[0].numLoans === 1
										? "1 loan"
										: `${data.filter(d => d.key === activeModal)[0].numLoans} loans`
								}
							</p>
						</div>
					</animated.div>
			})
			}
		</div>
	);
};

export default Modal;

Modal.propTypes = {
	data: PropTypes.arrayOf(PropTypes.object).isRequired,
	activeModal: PropTypes.string
};
