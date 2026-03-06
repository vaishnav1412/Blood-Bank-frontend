import { 
  FaTimes, 
  FaTrash, 
  FaImage, 
  FaUpload,
  FaFileImage,
  FaCalendarAlt,
  FaHospital,
  FaTint,
  FaWeightHanging,
  FaCheckCircle,
  FaSpinner,
  FaShieldAlt 
} from "react-icons/fa";

const DonationUploadForm = ({
  showDonationUpload,
  setShowDonationUpload,
  uploadForm,
  setUploadForm,
  handleUploadDonation,
  handleImageUpload,
  fileInputRef,
  clearImage,
  isUploading,
  user,
  bloodGroup
}) => {
  if (!showDonationUpload) return null;

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
                  <FaUpload className="text-white text-lg" />
                </div>
                Upload Donation Proof
              </h3>
              <p className="text-white/80 text-sm mt-1">Share your donation journey with the community</p>
            </div>

            <button
              type="button"
              onClick={() => setShowDonationUpload(false)}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 backdrop-blur-sm"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUploadDonation();
          }}
          className="p-6 space-y-6"
        >
          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaFileImage className="text-pink-600" />
              Donation Proof Image *
            </label>
            
            <div className="border-2 border-dashed border-pink-200 rounded-xl p-6 text-center hover:border-pink-500 transition-all bg-gradient-to-br from-pink-50/50 to-white group">
              {uploadForm.imagePreview ? (
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl blur opacity-50"></div>
                  <div className="relative">
                    <img
                      src={uploadForm.imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-xl shadow-2xl border-4 border-white"
                    />
                    
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-full hover:scale-110 transition-all shadow-lg"
                    >
                      <FaTrash className="text-sm" />
                    </button>

                    <div className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <FaCheckCircle />
                      Ready to upload
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                    <FaImage className="text-3xl text-pink-600" />
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Drag & drop or click to upload
                  </p>
                  <label className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl cursor-pointer text-sm font-bold hover:shadow-lg hover:scale-105 transition-all">
                    <FaUpload />
                    Choose File
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-3">
                    Supported: JPG, PNG, GIF • Max 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Donation Date */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaCalendarAlt className="text-pink-600" />
                Donation Date *
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition-opacity"></div>
                <input
                  type="date"
                  value={uploadForm.donationDate}
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      donationDate: e.target.value,
                    }))
                  }
                  className="relative w-full p-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:ring-0 outline-none bg-white"
                  required
                />
              </div>
            </div>

            {/* Donation Center */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaHospital className="text-pink-600" />
                Donation Center *
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition-opacity"></div>
                <input
                  type="text"
                  placeholder="e.g., City Hospital"
                  value={uploadForm.donationCenter}
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      donationCenter: e.target.value,
                    }))
                  }
                  className="relative w-full p-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:ring-0 outline-none bg-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Blood Group + Units */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaTint className="text-pink-600" />
                Blood Group
              </label>
              <select
                value={uploadForm.bloodGroup}
                onChange={(e) =>
                  setUploadForm((prev) => ({
                    ...prev,
                    bloodGroup: e.target.value,
                  }))
                }
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:ring-0 outline-none bg-white appearance-none cursor-pointer"
              >
                <option value={bloodGroup}>Same as Profile ({bloodGroup})</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaWeightHanging className="text-pink-600" />
                Units Donated
              </label>
              <select
                value={uploadForm.units}
                onChange={(e) =>
                  setUploadForm((prev) => ({
                    ...prev,
                    units: e.target.value,
                  }))
                }
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:ring-0 outline-none bg-white appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Unit' : 'Units'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-200 flex items-start gap-3">
            <FaShieldAlt className="text-pink-600 text-xl flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Secure Upload</h4>
              <p className="text-xs text-gray-600">
                Your donation proof will be verified by our team within 24-48 hours. 
                You'll receive a certificate upon verification.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowDonationUpload(false)}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-pink-400 transition-all transform hover:scale-[1.02]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload />
                  Upload Proof
                </>
              )}
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-center text-gray-400">
            By uploading, you confirm that this donation proof is genuine and belongs to you.
          </p>
        </form>
      </div>
    </div>
  );
};

export default DonationUploadForm;