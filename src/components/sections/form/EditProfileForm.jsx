import {
  FaTimes,
  FaUser,
  FaVenusMars,
  FaTint,
  FaBirthdayCake,
  FaWeight,
  FaTachometerAlt,
  FaHistory,
  FaCheckCircle,
} from "react-icons/fa";

const EditProfileForm = ({ user, setShowEditProfile, handleSaveProfile }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-8 animate-slideUp">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 sticky top-0 bg-white pb-3 border-b">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">
            Edit Profile
          </h3>

          <button
            onClick={() => setShowEditProfile(false)}
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

            handleSaveProfile({
              name: formData.get("name"),
              gender: formData.get("gender"),
              bloodGroup: formData.get("bloodGroup"),
              dob: formData.get("dob"),

              weight: formData.get("weight"),
              platelet: formData.get("platelet"),
              donationCount: formData.get("donationCount"),

              mobile: formData.get("mobile"),
              whatsapp: formData.get("whatsapp"),

              email: formData.get("email"),
              reEmail: formData.get("reEmail"),

              taluk: formData.get("taluk"),
              district: formData.get("district"),
            });
          }}
          className="space-y-4"
        >
          {/* Personal Info */}
          <h4 className="text-base font-bold text-gray-800">
            Personal Information
          </h4>

          {/* Name + Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaUser className="inline mr-2 text-pink-600" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                defaultValue={user?.name}
                className="w-full p-3 border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaVenusMars className="inline mr-2 text-pink-600" />
                Gender *
              </label>
              <select
                name="gender"
                required
                defaultValue={user?.gender}
                className="w-full p-3 border border-gray-300 rounded-xl"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Blood + DOB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaTint className="inline mr-2 text-pink-600" />
                Blood Group *
              </label>
              <select
                name="bloodGroup"
                required
                defaultValue={user?.bloodGroup}
                className="w-full p-3 border border-gray-300 rounded-xl"
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="O+">O+</option>
                <option value="AB+">AB+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaBirthdayCake className="inline mr-2 text-pink-600" />
                DOB *
              </label>
              <input
                type="date"
                name="dob"
                required
                defaultValue={user?.dob ? user.dob.substring(0, 10) : ""}
                className="w-full p-3 border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          {/* Weight + Platelet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaWeight className="inline mr-2 text-pink-600" />
                Weight *
              </label>
              <input
                type="number"
                name="weight"
                required
                defaultValue={user?.weight}
                className="w-full p-3 border border-gray-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaTachometerAlt className="inline mr-2 text-pink-600" />
                Platelet *
              </label>
              <select
                name="platelet"
                required
                defaultValue={user?.platelet}
                className="w-full p-3 border border-gray-300 rounded-xl"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* Donation Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaHistory className="inline mr-2 text-pink-600" />
              Donation Count *
            </label>
            <input
              type="number"
              name="donationCount"
              required
              defaultValue={user?.donationCount}
              className="w-full p-3 border border-gray-300 rounded-xl"
            />
          </div>

          {/* Contact */}
          <h4 className="text-base font-bold text-gray-800 mt-4">
            Contact Information
          </h4>

          {/* Mobile + WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="tel"
              name="mobile"
              defaultValue={user?.mobile}
              required
              className="w-full p-3 border border-gray-300 rounded-xl"
              placeholder="Mobile"
            />

            <input
              type="tel"
              name="whatsapp"
              defaultValue={user?.whatsapp}
              required
              className="w-full p-3 border border-gray-300 rounded-xl"
              placeholder="WhatsApp"
            />
          </div>

          {/* Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="email"
              name="email"
              defaultValue={user?.email}
              required
              className="w-full p-3 border border-gray-300 rounded-xl"
              placeholder="Email"
            />

            <input
              type="email"
              name="reEmail"
              defaultValue={user?.email}
              required
              className="w-full p-3 border border-gray-300 rounded-xl"
              placeholder="Confirm Email"
            />
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              name="taluk"
              defaultValue={user?.taluk}
              required
              className="w-full p-3 border border-gray-300 rounded-xl"
              placeholder="Taluk"
            />

            <input
              type="text"
              name="district"
              defaultValue={user?.district}
              required
              className="w-full p-3 border border-gray-300 rounded-xl"
              placeholder="District"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => setShowEditProfile(false)}
              className="flex-1 border-2 border-gray-300 py-3 rounded-xl font-bold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-pink-600 text-white py-3 rounded-xl font-bold flex items-center justify-center"
            >
              <FaCheckCircle className="mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;
