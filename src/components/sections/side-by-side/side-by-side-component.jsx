import { useState } from "react";
import PropTypes from "prop-types";
import "./side-by-side-styles.scss";

import GroupedHeadingComponent from "../grouped-heading/grouped-heading-component";
import ParaComponent from "../para/para-component";
import WrapperSection from "../wrapper-section/wrapper-section-component";
import ButtonComponent from "../button/button-component";

const SideBySideComponent = ({
	subheadingText,
	headingText,
	paraText,
	imageUrl,
	buttonText,
	buttonLink,
	classHint,
	buttonHave,
}) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleReadMore = () => setIsExpanded((prev) => !prev);
	const maxLength = 400;

	// Normalize paraText (string | string[])
	const text = Array.isArray(paraText) ? paraText.join("\n") : paraText;

	const shouldTrim = text.length > maxLength;
	const visibleText = isExpanded ? text : text.slice(0, maxLength);

	return (
		<WrapperSection>
			<div className="wrapper grid grid-cols0-1 lg:grid-cols-2">
				<div
					className={`my-image-col rounded-rmd z-[25] h-[400px] sm:h-[600px] w-full ${classHint}`}
					style={{ backgroundImage: `url(${imageUrl})` }}
				></div>

				<div className="content-wrapper p-[15px] py-[50px] sm:p-[50px] flex flex-col justify-center">
					<GroupedHeadingComponent
						subheadingText={subheadingText}
						headingText={headingText}
					/>

					<ParaComponent
						innerText={
							shouldTrim
								? `${visibleText}${isExpanded ? "" : "..."}`
								: text
						}
					/>

					{shouldTrim && (
						<button
							onClick={toggleReadMore}
							className="mt-2 text-sm self-start font-bold text-button_original"
						>
							{isExpanded ? "Read Less" : "Read More"}
						</button>
					)}

					{buttonHave && (
						<ButtonComponent
							buttonText={buttonText}
							buttonLink={buttonLink}
							buttonType="fill"
						/>
					)}
				</div>
			</div>
		</WrapperSection>
	);
};

/* =======================
   Prop Validation
======================= */

SideBySideComponent.propTypes = {
	subheadingText: PropTypes.string.isRequired,
	headingText: PropTypes.string.isRequired,

	paraText: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string),
	]).isRequired,

	imageUrl: PropTypes.string.isRequired,
	classHint: PropTypes.string,

	buttonHave: PropTypes.bool.isRequired,
	buttonText: PropTypes.string,
	buttonLink: PropTypes.string,
};

/* =======================
   Default Props
======================= */

SideBySideComponent.defaultProps = {
	classHint: "",
	buttonText: "",
	buttonLink: "#",
};

export default SideBySideComponent;
