import "./form-hero.scss"
import PropTypes from "prop-types";

const HeroComponent = ({ subheadingText, headingText, classHint }) => {
    return (
        <section className={`form-main-wrapper md:h-[90vh] h-[280px]  ${classHint}`}>
            <div className="form-main-container ">
                <div className="text-wrapper  sm:w-[650px] flex flex-col justify-center items-center ">
                    <h3 className="subheading hidden sm:block relative font-bold sm:text-[20px] leading-[2em] text-center tracking-[0.3em] uppercase text-off_white">
                        {subheadingText}
                    </h3>
                    <h1 className="font-bold hidden sm:block text-[35px] sm:text-[60px] leading-tight text-center capitalize text-white">
                        {headingText}
                    </h1>
                </div>
            </div>
        </section>
    );
};

HeroComponent.propTypes = {
    subheadingText: PropTypes.string.isRequired,
    headingText: PropTypes.string.isRequired,
    classHint: PropTypes.string,
};

export default HeroComponent;
