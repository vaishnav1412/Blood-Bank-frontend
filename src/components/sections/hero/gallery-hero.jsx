import "./hero-component-styles.scss";
import PropTypes from "prop-types";

const HeroComponent = ({ classHint }) => {
    return (
        <section className={`main-wrapper ${classHint}`}>
            <div className="main-container">
                <div className="text-wrapper sm:w-[650px] flex flex-col justify-center items-center">
                    
                </div>
            </div>
        </section>
    );
};

HeroComponent.propTypes = {
    classHint: PropTypes.string,
};

export default HeroComponent;
