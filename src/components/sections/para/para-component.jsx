import PropTypes from "prop-types";

const ParaComponent = ({ innerText, size }) => {
	return (
		<p
			className={`step-description not-italic font-medium ${
				size === "large" ? "text-[18px]" : "text-[16px]"
			} leading-7 text-light`}
		>
			{innerText}
		</p>
	);
};

/* =======================
   Prop Validation
======================= */

ParaComponent.propTypes = {
	innerText: PropTypes.string.isRequired,
	size: PropTypes.oneOf(["large", "small"]),
};

/* =======================
   Default Props
======================= */

ParaComponent.defaultProps = {
	size: "small",
};

export default ParaComponent;

