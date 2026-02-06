import { NavLink } from "react-router-dom";
import propTypes from "prop-types";

const ButtonComponent = ({ buttonText, buttonLink, buttonType }) => {
  return (
    <button
      className={`cta-btn 
            mt-5 rounded-rsm border 
            ${
              buttonType === "fill"
                ? "border-button_border text-white bg-button_original hover:bg-dark hover:text-white"
                : "border-off_white/[.5] text-dark bg-white hover:bg-button_original hover:text-white hover:border-button_border"
            }
            transition text-black px-8 py-3 text-sm w-fit font-bold`}
    >
      <NavLink to={buttonLink}>{buttonText}</NavLink>
    </button>
  );
};

ButtonComponent.propTypes = {
  buttonText: propTypes.string.isRequired,
  buttonLink: propTypes.string.isRequired,
  buttonType: propTypes.string.isRequired,
};

export default ButtonComponent;
