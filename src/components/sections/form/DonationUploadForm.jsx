import { FaTimes, FaTrash, FaImage, FaUpload } from "react-icons/fa";

const DonationUploadForm = ({
  showDonationUpload,
  setShowDonationUpload,
  uploadForm,
  setUploadForm,
  handleUploadDonation,
  handleImageUpload,
  fileInputRef,
  clearImage,
}) => {
  if (!showDonationUpload) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50">
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-8 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5 sticky top-0 bg-white pb-3 border-b z-10">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">
            Upload Donation Proof
          </h3>

          <button
            type="button"
            onClick={() => setShowDonationUpload(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl p-2"
          >
            <FaTimes />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUploadDonation();
          }}
          className="space-y-5"
        >
          {/* Image Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-pink-500 transition-colors">
            {uploadForm.imagePreview ? (
              <div className="relative">
                <img
                  src={uploadForm.imagePreview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg shadow-lg"
                />

                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                >
                  <FaTrash />
                </button>
              </div>
            ) : (
              <div>
                <FaImage className="text-4xl text-gray-400 mx-auto mb-3" />

                <p className="text-gray-600 mb-2 text-sm">
                  Tap to upload donation proof
                </p>

                <label className="inline-block bg-pink-600 text-white px-5 py-2.5 rounded-xl cursor-pointer text-sm hover:bg-pink-700 transition">
                  <FaUpload className="inline mr-2" />
                  Choose File

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Donation Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Donation Date *
            </label>
            <input
              type="date"
              value={uploadForm.donationDate}
              onChange={(e) =>
                setUploadForm((prev) => ({
                  ...prev,
                  donationDate: e.target.value,
                }))
              }
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
              required
            />
          </div>

          {/* Donation Center */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Donation Center *
            </label>
            <input
              type="text"
              placeholder="Hospital Name"
              value={uploadForm.donationCenter}
              onChange={(e) =>
                setUploadForm((prev) => ({
                  ...prev,
                  donationCenter: e.target.value,
                }))
              }
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
              required
            />
          </div>

          {/* Blood Group + Units */}
          <div className="grid grid-cols-2 gap-3">
            <select
              value={uploadForm.bloodGroup}
              onChange={(e) =>
                setUploadForm((prev) => ({
                  ...prev,
                  bloodGroup: e.target.value,
                }))
              }
              className="w-full p-3 border rounded-xl bg-white"
            >
              <option value="">Same as Profile</option>
              <option value="A+">A+</option>
              <option value="B+">B+</option>
              <option value="O+">O+</option>
              <option value="AB+">AB+</option>
            </select>

            <select
              value={uploadForm.units}
              onChange={(e) =>
                setUploadForm((prev) => ({
                  ...prev,
                  units: e.target.value,
                }))
              }
              className="w-full p-3 border rounded-xl bg-white"
            >
              <option value="1">1 Unit</option>
              <option value="2">2 Units</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => setShowDonationUpload(false)}
              className="flex-1 border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 transition"
            >
              Upload Proof
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationUploadForm;
