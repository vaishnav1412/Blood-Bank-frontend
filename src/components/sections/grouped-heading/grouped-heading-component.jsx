import PropTypes from "prop-types";

const GroupedHeadingComponent = ({
	subheadingText,
	headingText,
	mode = "dark",
	position = "left",
	boxWidth = "small",
}) => {
	return (
		<div
			className={`${boxWidth === "large" ? "sm:w-full" : "xlg:w-[650px]"} ${
				position === "center" ? "text-center" : "text-left"
			} heading-content-wrapper w-fit mb-5`}
		>
			<span
				className={`
					${position === "center" ? "text-center" : "text-left"}
					${mode === "light" ? "text-white" : "text-button_original"}
					not-italic font-medium text-[16px] sm:text-[20px] leading-normal tracking-[0.2em] uppercase`}
			>
				{subheadingText}
			</span>
			<h2
				className={`
					${position === "center" ? "text-center" : "text-left"}
					${mode === "light" ? "text-white" : "text-dark"}
					cta-heading not-italic font-semibold text-[35px] sm:text-[55px] leading-tight capitalize`}
			>
				{headingText}
			</h2>
		</div>
	);
};

GroupedHeadingComponent.propTypes = {
	subheadingText: PropTypes.string.isRequired,
	headingText: PropTypes.string.isRequired,

	mode: PropTypes.oneOf(["dark", "light"]),
	position: PropTypes.oneOf(["left", "center"]),
	boxWidth: PropTypes.oneOf(["small", "large"]),
};

export default GroupedHeadingComponent;
