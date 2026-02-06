import PropTypes from "prop-types";
import GroupedHeadingComponent from "../grouped-heading/grouped-heading-component";
import ProcessStepComponent from "../process-step/process-step-component";
import WrapperSection from "../wrapper-section/wrapper-section-component";

const ThreeStepProcessComponent = ({ stepDetails, stepsText }) => {
  return (
    <WrapperSection>
      <div className="wrapper">
        <GroupedHeadingComponent
          subheadingText={stepsText.subheadingText}
          headingText={stepsText.headingText}
        />
        <div className="process-steps-wrapper mt-5 sm:mt-10 grid md:grid-cols-[1fr_1fr_1fr]">
          {stepDetails.map((stepDetail, index) => (
            <ProcessStepComponent key={index} {...stepDetail} />
          ))}
        </div>
      </div>
    </WrapperSection>
  );
};

ThreeStepProcessComponent.propTypes = {
  stepsText: PropTypes.shape({
    subheadingText: PropTypes.string.isRequired,
    headingText: PropTypes.string.isRequired,
  }).isRequired,

  stepDetails: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      stepNumber: PropTypes.string.isRequired,
      stepName: PropTypes.string.isRequired,
      stepDescription: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default ThreeStepProcessComponent;
