import {
  FaTimes,
  FaWeight,
  FaTachometerAlt,
  FaCheckCircle,
} from "react-icons/fa";

const HealthStatusForm = ({ onClose, onSubmit }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-8 animate-slideUp">

        {/* Header */}
        <div className="flex justify-between items-center mb-5 sticky top-0 bg-white pb-3 border-b">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">
            Add Health Status
          </h3>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl p-2"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();

            const formData = new FormData(e.target);

            onSubmit({
              weight: formData.get("weight"),
              platelet: formData.get("platelet"),
              medicalConditions: formData.get("medicalConditions"),
              allergies: formData.get("allergies"),
            });
          }}
          className="space-y-4"
        >
          {/* Weight + Platelet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaWeight className="inline mr-2 text-pink-600" />
                Weight (kg) *
              </label>

              <input
                type="number"
                name="weight"
                step="0.1"
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 text-sm"
                placeholder="72"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaTachometerAlt className="inline mr-2 text-pink-600" />
                Platelet Count *
              </label>

              <input
                type="text"
                name="platelet"
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 text-sm"
                placeholder="2.5 lakhs"
              />
            </div>
          </div>

          {/* Medical Conditions */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Medical Conditions
            </label>

            <input
              type="text"
              name="medicalConditions"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 text-sm"
              defaultValue="None"
            />
          </div>

          {/* Allergies */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Allergies
            </label>

            <input
              type="text"
              name="allergies"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 text-sm"
              defaultValue="None"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-bold text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-pink-600 to-pink-700 text-white py-3 rounded-xl font-bold flex items-center justify-center text-sm"
            >
              <FaCheckCircle className="mr-2" />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthStatusForm;
