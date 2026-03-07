import { useState } from "react";
import {
  FaTimes,
  FaUser,
  FaVenusMars,
  FaTint,
  FaBirthdayCake,
  FaWeight,
  FaTachometerAlt,
  FaCheckCircle,
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaExclamationTriangle,
  FaSpinner,
  FaCalendarAlt,
} from "react-icons/fa";

const EditProfileForm = ({ user, setShowEditProfile, handleSaveProfile }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formValues, setFormValues] = useState({
    name: user?.name || "",
    gender: user?.gender || "",
    bloodGroup: user?.bloodGroup || "",
    dob: user?.dob ? user.dob.substring(0, 10) : "",
    weight: user?.weight || "",
    platelet: user?.platelet || "",
    lastDonationDate: user?.lastDonationDate ? user.lastDonationDate.substring(0, 10) : "", // Fixed field name
    mobile: user?.mobile || "",
    whatsapp: user?.whatsapp || "",
    email: user?.email || "",
    reEmail: user?.email || "",
    taluk: user?.taluk || "",
    district: user?.district || "",
  });
  const [errors, setErrors] = useState({});

  // Get today's date in YYYY-MM-DD format for max attribute
  const today = new Date().toISOString().split('T')[0];

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formValues.name) newErrors.name = "Full name is required";
    
    // Gender validation
    if (!formValues.gender) newErrors.gender = "Gender is required";
    
    // Blood Group validation
    if (!formValues.bloodGroup) newErrors.bloodGroup = "Blood group is required";
    
    // DOB validation
    if (!formValues.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const dobDate = new Date(formValues.dob);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      if (age < 18) newErrors.dob = "You must be at least 18 years old";
    }
    
    // Weight validation
    if (!formValues.weight) {
      newErrors.weight = "Weight is required";
    } else if (formValues.weight < 30 || formValues.weight > 200) {
      newErrors.weight = "Weight must be between 30-200 kg";
    }
    
    // Platelet validation
    if (!formValues.platelet) newErrors.platelet = "Platelet donation preference is required";
    
    // Mobile validation
    if (!formValues.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formValues.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }
    
    // WhatsApp validation (optional but if provided must be valid)
    if (formValues.whatsapp && !/^\d{10}$/.test(formValues.whatsapp)) {
      newErrors.whatsapp = "WhatsApp number must be 10 digits";
    }
    
    // Email validation
    if (!formValues.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Confirm email validation
    if (!formValues.reEmail) {
      newErrors.reEmail = "Please confirm your email";
    } else if (formValues.email !== formValues.reEmail) {
      newErrors.reEmail = "Emails do not match";
    }
    
    // District validation
    if (!formValues.district) newErrors.district = "District is required";
    
    // Taluk validation
    if (!formValues.taluk) newErrors.taluk = "Taluk is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      await handleSaveProfile(formValues);
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
        className="bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-sm rounded-t-3xl sm:rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50 animate-slideUp"
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
                  <FaUser className="text-white text-lg" />
                </div>
                Edit Profile
              </h3>
              <p className="text-white/80 text-sm mt-1">Update your personal information</p>
            </div>

            <button
              onClick={() => setShowEditProfile(false)}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 backdrop-blur-sm"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information Section */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg blur opacity-50"></div>
            <div className="relative bg-white/90 backdrop-blur-sm p-5 rounded-lg border border-pink-100 shadow-lg">
              <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
                <FaUser className="text-pink-500" />
                Personal Information
              </h4>
            </div>
          </div>

          {/* Name + Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FaUser className="text-pink-600" />
                Full Name *
              </label>
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 ${focusedField === 'name' ? 'opacity-30' : 'group-focus-within:opacity-30'} transition-opacity`}></div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formValues.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={`relative w-full p-3 border-2 rounded-xl focus:ring-0 outline-none bg-white transition-all ${
                    errors.name
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedField === 'name'
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-200 hover:border-pink-300"
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationTriangle />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FaVenusMars className="text-pink-600" />
                Gender *
              </label>
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 ${focusedField === 'gender' ? 'opacity-30' : 'group-focus-within:opacity-30'} transition-opacity`}></div>
                <select
                  name="gender"
                  required
                  value={formValues.gender}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('gender')}
                  onBlur={() => setFocusedField(null)}
                  className={`relative w-full p-3 border-2 rounded-xl focus:ring-0 outline-none bg-white transition-all appearance-none cursor-pointer ${
                    errors.gender
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedField === 'gender'
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-200 hover:border-pink-300"
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {errors.gender && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationTriangle />
                  {errors.gender}
                </p>
              )}
            </div>
          </div>

          {/* Blood Group + DOB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Blood Group */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FaTint className="text-pink-600" />
                Blood Group *
              </label>
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 ${focusedField === 'bloodGroup' ? 'opacity-30' : 'group-focus-within:opacity-30'} transition-opacity`}></div>
                <select
                  name="bloodGroup"
                  required
                  value={formValues.bloodGroup}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('bloodGroup')}
                  onBlur={() => setFocusedField(null)}
                  className={`relative w-full p-3 border-2 rounded-xl focus:ring-0 outline-none bg-white transition-all appearance-none cursor-pointer ${
                    errors.bloodGroup
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedField === 'bloodGroup'
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-200 hover:border-pink-300"
                  }`}
                >
                  <option value="">Select Blood Group</option>
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
              {errors.bloodGroup && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationTriangle />
                  {errors.bloodGroup}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FaBirthdayCake className="text-pink-600" />
                Date of Birth *
              </label>
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 ${focusedField === 'dob' ? 'opacity-30' : 'group-focus-within:opacity-30'} transition-opacity`}></div>
                <input
                  type="date"
                  name="dob"
                  required
                  value={formValues.dob}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('dob')}
                  onBlur={() => setFocusedField(null)}
                  max={today}
                  className={`relative w-full p-3 border-2 rounded-xl focus:ring-0 outline-none bg-white transition-all ${
                    errors.dob
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedField === 'dob'
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-200 hover:border-pink-300"
                  }`}
                />
              </div>
              {errors.dob && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationTriangle />
                  {errors.dob}
                </p>
              )}
            </div>
          </div>

          {/* Weight + Platelet */}
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
                  placeholder="Enter weight"
                />
              </div>
              {errors.weight && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationTriangle />
                  {errors.weight}
                </p>
              )}
            </div>

            {/* Platelet */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FaTachometerAlt className="text-pink-600" />
                Platelet Donation *
              </label>
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 ${focusedField === 'platelet' ? 'opacity-30' : 'group-focus-within:opacity-30'} transition-opacity`}></div>
                <select
                  name="platelet"
                  required
                  value={formValues.platelet}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('platelet')}
                  onBlur={() => setFocusedField(null)}
                  className={`relative w-full p-3 border-2 rounded-xl focus:ring-0 outline-none bg-white transition-all appearance-none cursor-pointer ${
                    errors.platelet
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedField === 'platelet'
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-200 hover:border-pink-300"
                  }`}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              {errors.platelet && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationTriangle />
                  {errors.platelet}
                </p>
              )}
            </div>
          </div>

          {/* Last Donated Date - Read Only Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FaCalendarAlt className="text-pink-600" />
              Last Donated Date
            </label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition-opacity"></div>
              <input
                type="date"
                name="lastDonationDate"
                value={formValues.lastDonationDate}
                className="relative w-full p-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-600 cursor-not-allowed"
                disabled
                readOnly
              />
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <FaShieldAlt className="text-slate-400" />
              Last donation date is automatically updated when you upload donation proof
            </p>
          </div>

          {/* Contact Information Section */}
          <div className="relative mt-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg blur opacity-50"></div>
            <div className="relative bg-white/90 backdrop-blur-sm p-5 rounded-lg border border-pink-100 shadow-lg">
              <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
                <FaPhone className="text-pink-500" />
                Contact Information
              </h4>
            </div>
          </div>

          {/* Mobile + WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mobile */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FaPhone className="text-pink-600" />
                Mobile Number *
              </label>
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 ${focusedField === 'mobile' ? 'opacity-30' : 'group-focus-within:opacity-30'} transition-opacity`}></div>
                <input
                  type="tel"
                  name="mobile"
                  required
                  value={formValues.mobile}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('mobile')}
                  onBlur={() => setFocusedField(null)}
                  className={`relative w-full p-3 border-2 rounded-xl focus:ring-0 outline-none bg-white transition-all ${
                    errors.mobile
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedField === 'mobile'
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-200 hover:border-pink-300"
                  }`}
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                />
              </div>
              {errors.mobile && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationTriangle />
                  {errors.mobile}
                </p>
              )}
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FaWhatsapp className="text-pink-600" />
                WhatsApp Number
              </label>
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 ${focusedField === 'whatsapp' ? 'opacity-30' : 'group-focus-within:opacity-30'} transition-opacity`}></div>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formValues.whatsapp}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('whatsapp')}
                  onBlur={() => setFocusedField(null)}
                  className={`relative w-full p-3 border-2 rounded-xl focus:ring-0 outline-none bg-white transition-all ${
                    errors.whatsapp
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedField === 'whatsapp'
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-200 hover:border-pink-300"
                  }`}
                  placeholder="Enter 10-digit WhatsApp number"
                  maxLength="10"
                />
              </div>
              {errors.whatsapp && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationTriangle />
                  {errors.whatsapp}
                </p>
              )}
            </div>
          </div>

          {/* Email + Confirm Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FaEnvelope className="text-pink-600" />
                Email Address *
              </label>
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 ${focusedField === 'email' ? 'opacity-30' : 'group-focus-within:opacity-30'} transition-opacity`}></div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formValues.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`relative w-full p-3 border-2 rounded-xl focus:ring-0 outline-none bg-white transition-all ${
                    errors.email
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedField === 'email'
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-200 hover:border-pink-300"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationTriangle />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Confirm Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FaEnvelope className="text-pink-600" />
                Confirm Email *
              </label>
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 ${focusedField === 'reEmail' ? 'opacity-30' : 'group-focus-within:opacity-30'} transition-opacity`}></div>
                <input
                  type="email"
                  name="reEmail"
                  required
                  value={formValues.reEmail}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('reEmail')}
                  onBlur={() => setFocusedField(null)}
                  className={`relative w-full p-3 border-2 rounded-xl focus:ring-0 outline-none bg-white transition-all ${
                    errors.reEmail
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedField === 'reEmail'
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-200 hover:border-pink-300"
                  }`}
                  placeholder="Confirm your email"
                />
              </div>
              {errors.reEmail && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationTriangle />
                  {errors.reEmail}
                </p>
              )}
            </div>
          </div>

          {/* Address Section */}
          <div className="relative mt-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg blur opacity-50"></div>
            <div className="relative bg-white/90 backdrop-blur-sm p-5 rounded-lg border border-pink-100 shadow-lg">
              <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
                <FaMapMarkerAlt className="text-pink-500" />
                Address Information
              </h4>
            </div>
          </div>

          {/* Taluk + District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Taluk */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FaMapMarkerAlt className="text-pink-600" />
                Taluk *
              </label>
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 ${focusedField === 'taluk' ? 'opacity-30' : 'group-focus-within:opacity-30'} transition-opacity`}></div>
                <input
                  type="text"
                  name="taluk"
                  required
                  value={formValues.taluk}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('taluk')}
                  onBlur={() => setFocusedField(null)}
                  className={`relative w-full p-3 border-2 rounded-xl focus:ring-0 outline-none bg-white transition-all ${
                    errors.taluk
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedField === 'taluk'
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-200 hover:border-pink-300"
                  }`}
                  placeholder="Enter taluk"
                />
              </div>
              {errors.taluk && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationTriangle />
                  {errors.taluk}
                </p>
              )}
            </div>

            {/* District */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FaMapMarkerAlt className="text-pink-600" />
                District *
              </label>
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 ${focusedField === 'district' ? 'opacity-30' : 'group-focus-within:opacity-30'} transition-opacity`}></div>
                <input
                  type="text"
                  name="district"
                  required
                  value={formValues.district}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('district')}
                  onBlur={() => setFocusedField(null)}
                  className={`relative w-full p-3 border-2 rounded-xl focus:ring-0 outline-none bg-white transition-all ${
                    errors.district
                      ? "border-rose-400 focus:border-rose-600"
                      : focusedField === 'district'
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-200 hover:border-pink-300"
                  }`}
                  placeholder="Enter district"
                />
              </div>
              {errors.district && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationTriangle />
                  {errors.district}
                </p>
              )}
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-200 flex items-start gap-3">
            <FaShieldAlt className="text-pink-600 text-xl flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Secure Information</h4>
              <p className="text-xs text-slate-600">
                Your personal information is encrypted and kept confidential. We only use this data for donation eligibility and communication.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowEditProfile(false)}
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
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;