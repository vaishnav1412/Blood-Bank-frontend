import PropTypes from "prop-types";
import ParaComponent from "../para/para-component";
import WrapperSection from "../wrapper-section/wrapper-section-component";

const ContactDetailsComponent = ({ contactDetails }) => {
  // Arrow Icon (Reusable)
  const ArrowIcon = ({ className = "" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  );

  return (
    <WrapperSection>
      {/* Wrapper Background Like Login */}
      <div className="bg-gradient-to-br from-pink-300 via-pink-100 to-pink-300 
        w-full py-16 px-4 sm:px-8 md:px-12 lg:px-20 
        rounded-2xl shadow-xl border border-pink-100"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl text-gray-800 mb-4">
            Contact Details
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get in touch through any of these convenient channels
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {contactDetails.map(
            ({ key, stepNumber, stepName, stepDescription, stepUrl }) => (
              <a
                key={key}
                href={stepUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-xl p-6 sm:p-8 
                border border-pink-100 shadow-md 
                hover:shadow-2xl hover:-translate-y-2 
                transition-all duration-300 flex flex-col h-full"
              >
                {/* Badge */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-14 h-14 bg-gradient-to-r from-pink-600 to-pink-700 
                    rounded-xl flex justify-center items-center 
                    shadow-lg group-hover:scale-110 transition-all duration-300"
                  >
                    <span className="font-bold text-xl sm:text-2xl text-white">
                      {stepNumber}
                    </span>
                  </div>

                  {/* Arrow */}
                  <ArrowIcon
                    className="ml-auto w-5 h-5 text-gray-300 
                    group-hover:text-pink-600 group-hover:translate-x-2 
                    transition-all duration-300"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-bold text-xl sm:text-2xl text-gray-800 
                    group-hover:text-pink-600 transition-colors duration-300"
                  >
                    {stepName}
                  </h3>

                  <ParaComponent
                    innerText={stepDescription}
                    size="large"
                    className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300"
                  />
                </div>

                {/* Footer Link */}
                <div className="mt-6 pt-6 border-t border-pink-100">
                  <span className="inline-flex items-center text-pink-600 font-semibold text-sm uppercase tracking-wide">
                    Visit Link
                    <ArrowIcon className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </div>
              </a>
            )
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for?
          </p>

          <a
            href="/contact"
            className="group inline-flex items-center justify-center 
            px-8 py-4 bg-gradient-to-r from-pink-600 to-pink-700 
            hover:from-pink-700 hover:to-pink-800 
            text-white font-semibold rounded-xl 
            transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            Contact Us Directly
            <ArrowIcon className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </WrapperSection>
  );
};

/* Prop Validation */
ContactDetailsComponent.propTypes = {
  contactDetails: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      stepNumber: PropTypes.string.isRequired,
      stepName: PropTypes.string.isRequired,
      stepDescription: PropTypes.string.isRequired,
      stepUrl: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ContactDetailsComponent;
