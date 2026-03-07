import { useState } from "react";
import {
  FaTimes,
  FaWeight,
  FaTachometerAlt,
  FaCheckCircle,
  FaHeartbeat,
  FaShieldAlt,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";

const HealthStatusForm = ({ onClose, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    weight: "",
    platelet: "",
    medicalConditions: "None",
    allergies: "None",
  });
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formValues.weight) {
      newErrors.weight = "Weight is required";
    } else if (formValues.weight < 30 || formValues.weight > 200) {
      newErrors.weight = "Weight must be between 30-200 kg";
    }

    if (!formValues.platelet) {
      newErrors.platelet = "Platelet count is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      await onSubmit(formValues);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-2 sm:p-4">
      <div 
        className="bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-sm rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative top bar */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-400 rounded-b-full"></div>

        {/* Header with gradient */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <FaHeartbeat className="text-white text-lg" />
                </div>
                Update Health Status
              </h3>
              <p className="text-white/80 text-sm mt-1">Keep your health information current for eligibility</p>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 backdrop-blur-sm"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Weight + Platelet Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Weight */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FaWeight className="text-pink-600" />
                Weight (kg) *
              </label>
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 ${focusedField === 'weight' ? 'opacity-30' : 'group-focus-within:opacity-30'} transition-opacity`}></div>
                <input
                  type="number"
                  name="weight"
                  step="0.1"
                  min="30"
                  max="200"
                  required
                  value={formValues.weight}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('weight')}
                  onBlur={() => setFocusedField(null)}
                  className={`relative w-full p-3 border-2 rounded-xl focus:ring-0 outline-none bg-white transition-all ${
                    errors.weight
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedField === 'weight'
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-200 hover:border-pink-300"
                  }`}
                  placeholder="Enter your weight"
                />
              </div>
              {errors.weight && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationTriangle />
                  {errors.weight}
                </p>
              )}
            </div>

            {/* Platelet Count */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FaTachometerAlt className="text-pink-600" />
                Platelet Count *
              </label>
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 ${focusedField === 'platelet' ? 'opacity-30' : 'group-focus-within:opacity-30'} transition-opacity`}></div>
                <input
                  type="text"
                  name="platelet"
                  required
                  value={formValues.platelet}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('platelet')}
                  onBlur={() => setFocusedField(null)}
                  className={`relative w-full p-3 border-2 rounded-xl focus:ring-0 outline-none bg-white transition-all ${
                    errors.platelet
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedField === 'platelet'
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-200 hover:border-pink-300"
                  }`}
                  placeholder="e.g., 2.5 lakhs"
                />
              </div>
              {errors.platelet && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationTriangle />
                  {errors.platelet}
                </p>
              )}
            </div>
          </div>

          {/* Medical Conditions */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaShieldAlt className="text-pink-600" />
              Medical Conditions
            </label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition-opacity"></div>
              <input
                type="text"
                name="medicalConditions"
                value={formValues.medicalConditions}
                onChange={handleChange}
                onFocus={() => setFocusedField('medicalConditions')}
                onBlur={() => setFocusedField(null)}
                className="relative w-full p-3 border-2 border-slate-200 rounded-xl focus:border-pink-400 focus:ring-0 outline-none bg-white transition-all hover:border-pink-300"
                placeholder="Enter any medical conditions (if none, leave as 'None')"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Include conditions like diabetes, hypertension, etc.
            </p>
          </div>

          {/* Allergies */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FaExclamationTriangle className="text-pink-600" />
              Allergies
            </label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition-opacity"></div>
              <input
                type="text"
                name="allergies"
                value={formValues.allergies}
                onChange={handleChange}
                onFocus={() => setFocusedField('allergies')}
                onBlur={() => setFocusedField(null)}
                className="relative w-full p-3 border-2 border-slate-200 rounded-xl focus:border-pink-400 focus:ring-0 outline-none bg-white transition-all hover:border-pink-300"
                placeholder="Enter any allergies (if none, leave as 'None')"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              List any known allergies to medications or substances
            </p>
          </div>

          {/* Health Disclaimer */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200 flex items-start gap-3">
            <FaHeartbeat className="text-amber-600 text-xl flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Important Health Note</h4>
              <p className="text-xs text-slate-600">
                Your health information helps us determine your eligibility for donation.
                Please ensure all information is accurate and up-to-date.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-pink-400 transition-all transform hover:scale-[1.02]"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  Save Health Status
                </>
              )}
            </button>
          </div>

          {/* Privacy Note */}
          <p className="text-xs text-center text-slate-400">
            Your health data is encrypted and kept confidential. Only used for donation eligibility.
          </p>
        </form>
      </div>
    </div>
  );
};

export default HealthStatusForm;