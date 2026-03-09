import { useState } from "react";
import PropTypes from "prop-types";
import "./form-component-register.scss";
import { DropdownIcon } from "../../dropdown-icon/dropdown-icon";
import { districtTalukMap } from "../../../../data/utils/districtTalukMap";
import WrapperSection from "../../wrapper-section/wrapper-section-component";
import {
  registerInputStyles,
  registerSelectStyles,
} from "../../../../data/style/style";

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

  // Get today's date in YYYY-MM-DD format for max attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <WrapperSection>
      {/* Form Container */}
      <div className="form-wrapper w-full max-w-4xl mx-auto relative md:-mt-[490px] -mt-[150px] bg-gradient-to-br ">
        {/* Animated gradient background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-600 rounded-2xl blur-xl opacity-75 animate-gradient-xy"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute top-0 -left-4 w-24 h-24 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-24 h-24 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-20 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Main Form Card */}
        <div className="relative bg-gradient-to-br from-white/80 via-white/80 to-white/90 backdrop-blur-sm p-6 py-8 lg:p-12 rounded-2xl shadow-2xl border border-white/50">
          {/* Decorative top bar */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-400 rounded-b-full"></div>

          {/* Header with Icon */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mb-4 shadow-lg shadow-pink-200/50 transform hover:scale-105 transition-transform duration-300">
              <svg
                className="w-10 h-10 text-white"
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
            <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-500 bg-clip-text text-transparent mb-2">
              {heading}
            </h3>
            <p className="text-slate-600">Join our life-saving community</p>
          </div>

          <form className="space-y-8 w-full" onSubmit={handleSubmit}>
            {/* Personal Details Section */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg blur opacity-50"></div>
              <div className="relative bg-white/90 backdrop-blur-sm p-5 rounded-lg border border-pink-100 shadow-lg">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
                  <svg
                    className="w-5 h-5 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Donor Personal Details
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2 relative group">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className={`${registerInputStyles} transition-all duration-300 border-2 ${
                    errors?.name
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedFields.name
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-400 hover:border-pink-300"
                  }`}
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
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.name || focusedFields.name
                      ? "-top-2.5 text-xs bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base text-slate-500"
                  }`}
                >
                  Full Name *
                </label>
                {errors?.name && (
                  <p className="error-message text-rose-600 text-xs mt-1.5 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-rose-600 rounded-full"></span>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="relative group">
                <select
                  name="gender"
                  id="gender"
                  required
                  className={`${registerSelectStyles} transition-all duration-300 border-2 ${
                    focusedFields.gender
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-400 hover:border-pink-300"
                  } ${formData.gender ? "text-slate-800" : "text-slate-500"}`}
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

                <DropdownIcon />
                <label
                  htmlFor="gender"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.gender || focusedFields.gender
                      ? "-top-2.5 text-xs bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base text-slate-500"
                  }`}
                >
                  Gender *
                </label>
                {errors?.gender && (
                  <p className="error-message text-rose-600 text-xs mt-1.5 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-rose-600 rounded-full"></span>
                    {errors.gender}
                  </p>
                )}
              </div>

              {/* Blood Group */}
              <div className="relative group">
                <select
                  name="bloodGroup"
                  id="bloodGroup"
                  required
                  className={`${registerSelectStyles} transition-all duration-300 border-2 ${
                    focusedFields.bloodGroup
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-400 hover:border-pink-300"
                  } ${formData.bloodGroup ? "text-slate-800" : "text-slate-500"}`}
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

                <DropdownIcon />
                <label
                  htmlFor="bloodGroup"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.bloodGroup || focusedFields.bloodGroup
                      ? "-top-2.5 text-xs bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base text-slate-500"
                  }`}
                >
                  Blood Group *
                </label>
              </div>

              {/* Date of Birth */}
              <div className="relative group">
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  required
                  className={`${registerInputStyles} transition-all duration-300 border-2 ${
                    errors?.dob
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedFields.dob
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-400 hover:border-pink-300"
                  } ${formData.dob ? "text-slate-800" : "text-slate-500"}`}
                  value={formData.dob || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                  onFocus={() => handleFocus("dob")}
                  onBlur={() => handleBlur("dob")}
                  placeholder=" "
                  max={today}
                />
                <label
                  htmlFor="dob"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.dob || focusedFields.dob
                      ? "-top-2.5 text-xs bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base text-slate-500"
                  }`}
                >
                  Date of Birth *
                </label>
                {errors?.dob && (
                  <p className="error-message text-rose-600 text-xs mt-1.5 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-rose-600 rounded-full"></span>
                    {errors.dob}
                  </p>
                )}
              </div>

              {/* Weight */}
              <div className="relative group">
                <input
                  type="number"
                  name="weight"
                  id="weight"
                  required
                  min="30"
                  max="200"
                  className={`${registerInputStyles} transition-all duration-300 border-2 ${
                    errors?.weight
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedFields.weight
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-400 hover:border-pink-300"
                  }`}
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
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.weight || focusedFields.weight
                      ? "-top-2.5 text-xs bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base text-slate-500"
                  }`}
                >
                  Weight (KG) *
                </label>
                {errors?.weight && (
                  <p className="error-message text-rose-600 text-xs mt-1.5 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-rose-600 rounded-full"></span>
                    {errors.weight}
                  </p>
                )}
              </div>

              {/* Platelet Donation */}
              <div className="relative group">
                <select
                  name="platelet"
                  id="platelet"
                  required
                  className={`${registerSelectStyles} transition-all duration-300 border-2 ${
                    focusedFields.platelet
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-400 hover:border-pink-300"
                  } ${formData.platelet ? "text-slate-800" : "text-slate-500"}`}
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

                <DropdownIcon />
                <label
                  htmlFor="platelet"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.platelet || focusedFields.platelet
                      ? "-top-2.5 text-xs bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base text-slate-500"
                  }`}
                >
                  Willing to donate Platelet? *
                </label>
                {errors?.platelet && (
                  <p className="error-message text-rose-600 text-xs mt-1.5 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-rose-600 rounded-full"></span>
                    {errors.platelet}
                  </p>
                )}
              </div>

              {/* Last Donated Date - REPLACED Donation Count */}
              <div className="relative group">
                <input
                  type="date"
                  name="lastDonationDate"
                  id="lastDonationDate"
                  className={`${registerInputStyles} transition-all duration-300 border-2 ${
                    errors?.latestDonatedDate
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedFields.latestDonatedDate
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-400 hover:border-pink-300"
                  } ${formData.latestDonatedDate ? "text-slate-800" : "text-slate-500"}`}
                  value={formData.latestDonatedDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, latestDonatedDate: e.target.value })
                  }
                  onFocus={() => handleFocus("lastDonationDate")}
                  onBlur={() => handleBlur("lastDonationDate")}
                  placeholder=" "
                  max={today}
                />
                <label
                  htmlFor="lastDonationDate"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.latestDonatedDate|| focusedFields.latestDonatedDate
                      ? "-top-2.5 text-xs bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base text-slate-500"
                  }`}
                >
                  Last Donated Date *
                </label>
                {errors?.lastDonationDate && (
                  <p className="error-message text-rose-600 text-xs mt-1.5 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-rose-600 rounded-full"></span>
                    {errors.lastDonationDate}
                  </p>
                )}
              </div>
            </div>

            {/* Communication Details Section */}
            <div className="relative mt-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg blur opacity-50"></div>
              <div className="relative bg-white/90 backdrop-blur-sm p-5 rounded-lg border border-pink-100 shadow-lg">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
                  <svg
                    className="w-5 h-5 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Communication Details
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* District */}
              <div className="relative group">
                <select
                  name="district"
                  id="district"
                  required
                  className={`${registerSelectStyles} transition-all duration-300 border-2 ${
                    focusedFields.district
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-400 hover:border-pink-300"
                  } ${formData.district ? "text-slate-800" : "text-slate-500"}`}
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

                <DropdownIcon />
                <label
                  htmlFor="district"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.district || focusedFields.district
                      ? "-top-2.5 text-xs bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base text-slate-500"
                  }`}
                >
                  District *
                </label>
              </div>

              {/* Taluk */}
              <div className="relative group">
                <select
                  name="taluk"
                  id="taluk"
                  required
                  disabled={!formData.district}
                  className={`${registerSelectStyles} transition-all duration-300 border-2 ${
                    !formData.district
                      ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                      : focusedFields.taluk
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-400 hover:border-pink-300"
                  } ${formData.taluk ? "text-slate-800" : "text-slate-500"}`}
                  value={formData.taluk || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, taluk: e.target.value })
                  }
                  onFocus={() => handleFocus("taluk")}
                  onBlur={() => handleBlur("taluk")}
                >
                  <option value=""></option>
                  {availableTaluks.map((taluk) => (
                    <option key={taluk} value={taluk}>
                      {taluk}
                    </option>
                  ))}
                </select>

                <DropdownIcon />
                <label
                  htmlFor="taluk"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.taluk || focusedFields.taluk
                      ? "-top-2.5 text-xs bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base text-slate-500"
                  }`}
                >
                  Taluk *
                </label>
              </div>

              {/* Mobile */}
              <div className="relative group">
                <input
                  type="tel"
                  name="mobile"
                  id="mobile"
                  pattern="[0-9]{10}"
                  required
                  className={`${registerInputStyles} transition-all duration-300 border-2 ${
                    errors?.mobile
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedFields.mobile
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-400 hover:border-pink-300"
                  }`}
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
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.mobile || focusedFields.mobile
                      ? "-top-2.5 text-xs bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base text-slate-500"
                  }`}
                >
                  Mobile Number *
                </label>
                {errors?.mobile && (
                  <p className="error-message text-rose-600 text-xs mt-1.5 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-rose-600 rounded-full"></span>
                    {errors.mobile}
                  </p>
                )}
              </div>

              {/* WhatsApp */}
              <div className="relative group">
                <input
                  type="tel"
                  name="whatsapp"
                  id="whatsapp"
                  pattern="[0-9]{10}"
                  required
                  className={`${registerInputStyles} transition-all duration-300 border-2 ${
                    errors?.whatsapp
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedFields.whatsapp
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-400 hover:border-pink-300"
                  }`}
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
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.whatsapp || focusedFields.whatsapp
                      ? "-top-2.5 text-xs bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base text-slate-500"
                  }`}
                >
                  WhatsApp Number *
                </label>
                {errors?.whatsapp && (
                  <p className="error-message text-rose-600 text-xs mt-1.5 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-rose-600 rounded-full"></span>
                    {errors.whatsapp}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className={`${registerInputStyles} transition-all duration-300 border-2 ${
                    errors?.email
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedFields.email
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-400 hover:border-pink-300"
                  }`}
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
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.email || focusedFields.email
                      ? "-top-2.5 text-xs bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base text-slate-500"
                  }`}
                >
                  Email Address *
                </label>
                {errors?.email && (
                  <p className="error-message text-rose-600 text-xs mt-1.5 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-rose-600 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Re-enter Email */}
              <div className="relative group">
                <input
                  type="email"
                  name="reEmail"
                  id="reEmail"
                  required
                  className={`${registerInputStyles} transition-all duration-300 border-2 ${
                    errors?.reEmail
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedFields.reEmail
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-400 hover:border-pink-300"
                  }`}
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
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.reEmail || focusedFields.reEmail
                      ? "-top-2.5 text-xs bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base text-slate-500"
                  }`}
                >
                  Confirm Email *
                </label>
                {errors?.reEmail && (
                  <p className="error-message text-rose-600 text-xs mt-1.5 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-rose-600 rounded-full"></span>
                    {errors.reEmail}
                  </p>
                )}
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg blur opacity-50"></div>
              <div className="relative bg-white/90 backdrop-blur-sm p-5 rounded-lg border border-pink-100 shadow-lg">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    required
                    className="mt-0.5 w-4 h-4 rounded border-slate-400 text-pink-600 focus:ring-pink-500 focus:ring-offset-0 transition-all duration-200 cursor-pointer"
                    checked={formData.agreeToPolicy || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agreeToPolicy: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="privacy" className="text-slate-700 text-sm">
                    I agree to the{" "}
                    <a
                      href="/privacy-policy"
                      className="text-pink-600 hover:text-purple-600 font-medium hover:underline transition-colors"
                    >
                      privacy policy
                    </a>{" "}
                    &amp;{" "}
                    <a
                      href="/terms"
                      className="text-pink-600 hover:text-purple-600 font-medium hover:underline transition-colors"
                    >
                      terms of service
                    </a>
                  </label>
                </div>
                {errors?.agreeToPolicy && (
                  <p className="error-message text-rose-600 text-xs mt-2 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-rose-600 rounded-full"></span>
                    {errors.agreeToPolicy}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`relative w-full py-4 px-6 rounded-xl font-bold transition-all duration-500 overflow-hidden group ${
                  !loading
                    ? "bg-gradient-to-r from-pink-600 via-purple-500 to-pink-600 bg-[length:200%_100%] hover:bg-[length:100%_100%] text-white shadow-lg hover:shadow-2xl hover:shadow-pink-500/30 transform hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-gradient-to-r from-pink-400 to-purple-400 text-white cursor-not-allowed opacity-70"
                }`}
              >
                {/* Animated background shine effect */}
                {!loading && (
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}

                <span className="relative flex items-center justify-center gap-2">
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="tracking-wide">Submitting...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span className="relative">
                        {buttonText}
                        <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-white/70 transition-all duration-300" />
                      </span>
                      <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                        →
                      </span>
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Login Navigation */}
            <div className="text-center pt-6 border-t border-pink-200">
              <p className="text-slate-600 text-sm">
                Already a member?{" "}
                <a
                  href="/login"
                  className="text-pink-600 hover:text-purple-600 font-semibold transition-all duration-200 hover:underline decoration-2 underline-offset-2"
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
    latestDonatedDate: PropTypes.string, // Changed from donationCount
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