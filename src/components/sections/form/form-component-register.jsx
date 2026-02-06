import { useState } from "react";
import PropTypes from "prop-types";
import "./form-component-styles.scss";
import { DropdownIcon } from "../dropdown-icon/dropdown-icon";
import { districtTalukMap } from "../../../data/utils/districtTalukMap";
import WrapperSection from "../wrapper-section/wrapper-section-component";
import { registerInputStyles ,registerSelectStyles} from "../../../data/style/style";
const FormComponentRegister = ({
  heading,
  buttonText,
  formData,
  setFormData,
  handleSubmit,
  errors,
  loading,
}) => {
  const [availableTaluks, setAvailableTaluks] = useState([]);
  const [focusedFields, setFocusedFields] = useState({});

  const handleFocus = (fieldName) => {
    setFocusedFields((prev) => ({ ...prev, [fieldName]: true }));
  };

  const handleBlur = (fieldName) => {
    setFocusedFields((prev) => ({ ...prev, [fieldName]: false }));
  };
  const labelStyles = `absolute left-4 transition-all duration-200 pointer-events-none peer-focus:text-xs peer-focus:-top-2 peer-focus:text-pink-600 ${
    focusedFields ? "text-gray-500" : "text-gray-600"
  }`;

 

  return (
    <WrapperSection>
      {/* Form Container with Pink Border Effect */}
      <div className="form-wrapper w-full max-w-4xl mx-auto relative -mt-44">
        {/* Pink Gradient Border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 via-pink-300 to-pink-400 rounded-2xl blur opacity-30"></div>

        {/* Main Form Card */}
        <div className="relative bg-gradient-to-br from-pink_super_light via-white to-pink-50 p-6 py-8 lg:p-12 rounded-2xl shadow-xl border border-pink-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 mb-4 shadow-md">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{heading}</h3>
            <p className="text-gray-600">Join our life-saving community</p>
          </div>

          <form className="space-y-6 w-full" onSubmit={handleSubmit}>
            {/* Personal Details Section */}
            <div className="bg-gradient-to-r from-pink-50 to-pink-100/50 p-4 rounded-lg border-l-4 border-pink-400 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                Donor Personal Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2 relative">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className={registerInputStyles}
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  onFocus={() => handleFocus("name")}
                  onBlur={() => handleBlur("name")}
                  placeholder=" "
                />
                <label
                  htmlFor="name"
                  className={`${labelStyles} ${
                    formData.name || focusedFields.name
                      ? "text-xs -top-2 bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base"
                  }`}
                >
                  Full Name *
                </label>
                {errors?.name && (
                  <p className="mt-1 text-sm text-pink-700 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="relative">
                <select
                  name="gender"
                  id="gender"
                  required
                  className={`${registerSelectStyles} ${
                    formData.gender ? "text-gray-800" : "text-gray-500"
                  }`}
                  value={formData.gender || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  onFocus={() => handleFocus("gender")}
                  onBlur={() => handleBlur("gender")}
                >
                  <option value=""></option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                {/* ✅ Custom Dropdown Icon */}
                <DropdownIcon/>

                {/* ✅ Floating Label */}
                <label
                  htmlFor="gender"
                  className={`${labelStyles} ${
                    formData.gender || focusedFields.gender
                      ? "text-xs -top-2 bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base"
                  }`}
                >
                  Gender *
                </label>

                {/* Error */}
                {errors?.gender && (
                  <p className="mt-1 text-sm text-pink-700">{errors.gender}</p>
                )}
              </div>

              {/* Blood Group */}
              <div className="relative">
                <select
                  name="bloodGroup"
                  id="bloodGroup"
                  required
                  className={`${registerSelectStyles} ${
                    formData.bloodGroup ? "text-gray-800" : "text-gray-500"
                  }`}
                  value={formData.bloodGroup || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bloodGroup: e.target.value })
                  }
                  onFocus={() => handleFocus("bloodGroup")}
                  onBlur={() => handleBlur("bloodGroup")}
                >
                  <option value=""></option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>

                {/* Dropdown Icon */}
               <DropdownIcon/>

                {/* Label */}
                <label
                  htmlFor="bloodGroup"
                  className={`${labelStyles} ${
                    formData.bloodGroup || focusedFields.bloodGroup
                      ? "text-xs -top-2 bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base"
                  }`}
                >
                  Blood Group *
                </label>
              </div>

              {/* Date of Birth */}
              <div className="relative">
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  required
                  className={`${registerInputStyles} ${
                    formData.dob ? "text-gray-800" : "text-gray-500"
                  }`}
                  value={formData.dob || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                  onFocus={() => handleFocus("dob")}
                  onBlur={() => handleBlur("dob")}
                  placeholder=" "
                />
                <label
                  htmlFor="dob"
                  className={`${labelStyles} ${
                    formData.dob || focusedFields.dob
                      ? "text-xs -top-2 bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base"
                  }`}
                >
                  Date of Birth *
                </label>
                {errors?.dob && (
                  <p className="mt-1 text-sm text-pink-700 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.dob}
                  </p>
                )}
              </div>

              {/* Weight */}
              <div className="relative">
                <input
                  type="number"
                  name="weight"
                  id="weight"
                  required
                  className={registerInputStyles}
                  value={formData.weight || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  onFocus={() => handleFocus("weight")}
                  onBlur={() => handleBlur("weight")}
                  placeholder=" "
                />
                <label
                  htmlFor="weight"
                  className={`${labelStyles} ${
                    formData.weight || focusedFields.weight
                      ? "text-xs -top-2 bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base"
                  }`}
                >
                  Weight (KG) *
                </label>
                {errors?.weight && (
                  <p className="mt-1 text-sm text-pink-700 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.weight}
                  </p>
                )}
              </div>

              {/* Platelet Donation */}
              <div className="relative">
                <select
                  name="platelet"
                  id="platelet"
                  required
                  className={`${registerSelectStyles} ${
                    formData.platelet ? "text-gray-800" : "text-gray-500"
                  }`}
                  value={formData.platelet || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, platelet: e.target.value })
                  }
                  onFocus={() => handleFocus("platelet")}
                  onBlur={() => handleBlur("platelet")}
                >
                  <option value=""></option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                {/* ✅ Dropdown Icon */}
               <DropdownIcon/>

                {/* ✅ Floating Label */}
                <label
                  htmlFor="platelet"
                  className={`${labelStyles} ${
                    formData.platelet || focusedFields.platelet
                      ? "text-xs -top-2 bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base"
                  }`}
                >
                  Willing to donate Platelet? *
                </label>

                {/* ✅ Error Message */}
                {errors?.platelet && (
                  <p className="mt-1 text-sm text-pink-700 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.platelet}
                  </p>
                )}
              </div>

              {/* Donation Count */}
              <div className="relative">
                <input
                  type="number"
                  name="donationCount"
                  id="donationCount"
                  min="0"
                  required
                  className={registerInputStyles}
                  value={formData.donationCount || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, donationCount: e.target.value })
                  }
                  onFocus={() => handleFocus("donationCount")}
                  onBlur={() => handleBlur("donationCount")}
                  placeholder=" "
                />
                <label
                  htmlFor="donationCount"
                  className={`${labelStyles} ${
                    formData.donationCount || focusedFields.donationCount
                      ? "text-xs -top-2 bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base"
                  }`}
                >
                  Previous Donations *
                </label>
                {errors?.donationCount && (
                  <p className="mt-1 text-sm text-pink-700 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.donationCount}
                  </p>
                )}
              </div>
            </div>

            {/* Communication Details Section */}
            <div className="bg-gradient-to-r from-pink-50 to-pink-100/50 p-4 rounded-lg border-l-4 border-pink-400 shadow-sm mt-8">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                Communication Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* District */}
              <div className="relative">
                <select
                  name="district"
                  id="district"
                  required
                  className={`${registerSelectStyles} ${
                    formData.district ? "text-gray-800" : "text-gray-500"
                  }`}
                  value={formData.district || ""}
                  onChange={(e) => {
                    const selectedDistrict = e.target.value;
                    setFormData({
                      ...formData,
                      district: selectedDistrict,
                      taluk: "",
                    });
                    setAvailableTaluks(
                      districtTalukMap[selectedDistrict] || [],
                    );
                  }}
                  onFocus={() => handleFocus("district")}
                  onBlur={() => handleBlur("district")}
                >
                  <option value=""></option>
                  {Object.keys(districtTalukMap).map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>

                {/* Dropdown Icon */}
              <DropdownIcon/>

                {/* Label */}
                <label
                  htmlFor="district"
                  className={`${labelStyles} ${
                    formData.district || focusedFields.district
                      ? "text-xs -top-2 bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base"
                  }`}
                >
                  District *
                </label>
              </div>

              {/* Taluk */}
              <div className="relative">
                <select
                  name="taluk"
                  id="taluk"
                  required
                  disabled={!formData.district}
                  className={`${registerSelectStyles} ${
                    !formData.district
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : formData.taluk
                        ? "text-gray-800"
                        : "text-gray-500"
                  }`}
                  value={formData.taluk || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, taluk: e.target.value })
                  }
                >
                  <option value=""></option>
                  {availableTaluks.map((taluk) => (
                    <option key={taluk} value={taluk}>
                      {taluk}
                    </option>
                  ))}
                </select>

                {/* Dropdown Icon */}
                <DropdownIcon/>

                {/* Label */}
                <label
                  htmlFor="taluk"
                  className={`${labelStyles} ${
                    formData.taluk || focusedFields.taluk
                      ? "text-xs -top-2 bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base"
                  }`}
                >
                  Taluk *
                </label>
              </div>

              {/* Mobile */}
              <div className="relative">
                <input
                  type="tel"
                  name="mobile"
                  id="mobile"
                  pattern="[0-9]{10}"
                  required
                  className={registerInputStyles}
                  value={formData.mobile || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  onFocus={() => handleFocus("mobile")}
                  onBlur={() => handleBlur("mobile")}
                  placeholder=" "
                />
                <label
                  htmlFor="mobile"
                  className={`${labelStyles} ${
                    formData.mobile || focusedFields.mobile
                      ? "text-xs -top-2 bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base"
                  }`}
                >
                  Mobile Number *
                </label>
                {errors?.mobile && (
                  <p className="mt-1 text-sm text-pink-700 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.mobile}
                  </p>
                )}
              </div>

              {/* WhatsApp */}
              <div className="relative">
                <input
                  type="tel"
                  name="whatsapp"
                  id="whatsapp"
                  pattern="[0-9]{10}"
                  required
                  className={registerInputStyles}
                  value={formData.whatsapp || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: e.target.value })
                  }
                  onFocus={() => handleFocus("whatsapp")}
                  onBlur={() => handleBlur("whatsapp")}
                  placeholder=" "
                />
                <label
                  htmlFor="whatsapp"
                  className={`${labelStyles} ${
                    formData.whatsapp || focusedFields.whatsapp
                      ? "text-xs -top-2 bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base"
                  }`}
                >
                  WhatsApp Number *
                </label>
                {errors?.whatsapp && (
                  <p className="mt-1 text-sm text-pink-700 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.whatsapp}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className={registerInputStyles}
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  onFocus={() => handleFocus("email")}
                  onBlur={() => handleBlur("email")}
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className={`${labelStyles} ${
                    formData.email || focusedFields.email
                      ? "text-xs -top-2 bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base"
                  }`}
                >
                  Email Address *
                </label>
                {errors?.email && (
                  <p className="mt-1 text-sm text-pink-700 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Re-enter Email */}
              <div className="relative">
                <input
                  type="email"
                  name="reEmail"
                  id="reEmail"
                  required
                  className={registerInputStyles}
                  value={formData.reEmail || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, reEmail: e.target.value })
                  }
                  onFocus={() => handleFocus("reEmail")}
                  onBlur={() => handleBlur("reEmail")}
                  placeholder=" "
                />
                <label
                  htmlFor="reEmail"
                  className={`${labelStyles} ${
                    formData.reEmail || focusedFields.reEmail
                      ? "text-xs -top-2 bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base"
                  }`}
                >
                  Confirm Email *
                </label>
                {errors?.reEmail && (
                  <p className="mt-1 text-sm text-pink-700 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.reEmail}
                  </p>
                )}
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="bg-pink-50/80 p-4 rounded-lg border border-pink-100">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="privacy"
                  required
                  className="mt-1 h-4 w-4  accent-pink-600"
                  checked={formData.agreeToPolicy || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      agreeToPolicy: e.target.checked,
                    })
                  }
                />
                <label htmlFor="privacy" className="text-gray-700 text-sm">
                  I agree to the{" "}
                  <a
                    href="/privacy-policy"
                    className="text-pink-600 hover:text-pink-800 font-medium hover:underline"
                  >
                    privacy policy
                  </a>{" "}
                  &amp;{" "}
                  <a
                    href="/terms"
                    className="text-pink-600 hover:text-pink-800 font-medium hover:underline"
                  >
                    terms of service
                  </a>
                </label>
              </div>
              {errors?.agreeToPolicy && (
                <p className="mt-2 text-sm text-pink-700 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.agreeToPolicy}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      ></path>
                    </svg>
                    {buttonText}
                  </>
                )}
              </button>
            </div>

            {/* Login Navigation */}
            <div className="text-center pt-6 border-t border-pink-100">
              <p className="text-gray-600 text-sm">
                Already a member?{" "}
                <a
                  href="/donate-blood"
                  className="text-pink-600 hover:text-pink-800 font-semibold hover:underline transition-colors"
                >
                  Log in here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </WrapperSection>
  );
};

/* =======================
   Prop Validation
======================= */

FormComponentRegister.propTypes = {
  heading: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,

  formData: PropTypes.shape({
    name: PropTypes.string,
    gender: PropTypes.string,
    bloodGroup: PropTypes.string,
    dob: PropTypes.string,
    weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    platelet: PropTypes.string,
    donationCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    district: PropTypes.string,
    taluk: PropTypes.string,

    mobile: PropTypes.string,
    whatsapp: PropTypes.string,

    email: PropTypes.string,
    reEmail: PropTypes.string,

    agreeToPolicy: PropTypes.bool,
  }).isRequired,

  setFormData: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,

  errors: PropTypes.object,
  loading: PropTypes.bool,
};

/* =======================
   Default Props
======================= */

FormComponentRegister.defaultProps = {
  errors: {},
  loading: false,
};

export default FormComponentRegister;
