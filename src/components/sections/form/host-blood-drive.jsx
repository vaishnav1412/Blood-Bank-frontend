import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaUniversity,
  FaFileAlt,
  FaPaperPlane,
  FaSpinner,
  FaCalendarCheck,
  FaChartLine,
} from "react-icons/fa";
import "./host-blood-drive";
import toast from "react-hot-toast";
import WrapperSection from "../wrapper-section/wrapper-section-component";
import { organizationTypes ,organizationTypeUI,statusUI} from "../../../data/content/camp";
import { submitBloodDriveApplication,fetchAllCampRequests } from "../../../services/donorServices";
import { getErrorMessage } from "../../../utils/getErrorMessage";


const HostBloodDrive = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    organizationType: "",
    organizationName: "",
    contactPerson: "",
    designation: "",
    email: "",
    phone: "",
    alternatePhone: "",

    // Step 2: Event Details
    eventDate: "",
    eventTime: "",
    duration: "4",
    expectedDonors: "50",
    venue: "",
    address: "",
    city: "",
    pincode: "",

    // Step 3: Requirements
    requiredStaff: "2",
    equipment: ["mobile-blood-bank", "snacks"],
    specialRequirements: "",
    previousExperience: "no",

    // Step 4: Additional Info
    targetGroup: "students",
    awarenessProgram: "yes",
    publicitySupport: "yes",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [camp,setCamp] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [upcomingCamps, setUpcomingCamps] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

 console.log(camp);
 
  

  useEffect(() => {
    campDetails()
    setUpcomingCamps(camp);
  }, []);


 const campDetails = async () => {
  try {
    const data = await fetchAllCampRequests();

    console.log("All Camp Requests:", data);

    // ✅ Save into state
    setCamp(data.camps); 
  } catch (error) {
    console.error("Error fetching camp requests:", error);

    toast.error(getErrorMessage(error));
  }
};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleEquipmentChange = (equipment) => {
    setFormData((prev) => {
      const currentEquipment = [...prev.equipment];
      const index = currentEquipment.indexOf(equipment);

      if (index > -1) {
        currentEquipment.splice(index, 1);
      } else {
        currentEquipment.push(equipment);
      }

      return { ...prev, equipment: currentEquipment };
    });
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.organizationType)
          newErrors.organizationType = "Please select organization type";
        if (!formData.organizationName.trim())
          newErrors.organizationName = "Organization name is required";
        if (!formData.contactPerson.trim())
          newErrors.contactPerson = "Contact person name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
          newErrors.email = "Invalid email format";
        if (!formData.phone.trim())
          newErrors.phone = "Phone number is required";
        else if (!/^[0-9]{10}$/.test(formData.phone))
          newErrors.phone = "10-digit number required";
        break;

      case 2:
        if (!formData.eventDate) newErrors.eventDate = "Please select a date";
        if (!formData.eventTime) newErrors.eventTime = "Please select time";
        if (!formData.venue.trim()) newErrors.venue = "Venue name is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
        else if (!/^[0-9]{6}$/.test(formData.pincode))
          newErrors.pincode = "Invalid pincode";
        break;

      case 3:
        if (formData.expectedDonors < 20)
          newErrors.expectedDonors = "Minimum 20 donors required";
        break;

      case 4:
        if (!formData.termsAccepted)
          newErrors.termsAccepted = "You must accept terms & conditions";
        break;
    }

    return newErrors;
  };

  const nextStep = () => {
    const stepErrors = validateStep(activeStep);

    if (Object.keys(stepErrors).length === 0) {
      setActiveStep((prev) => Math.min(prev + 1, 4));
      setErrors({});
    } else {
      setErrors(stepErrors);
      // Shake animation for errors
      document.querySelectorAll(".form-step").forEach((el) => {
        el.classList.add("shake-animation");
        setTimeout(() => el.classList.remove("shake-animation"), 500);
      });
    }
  };

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const finalErrors = validateStep(4);
  if (Object.keys(finalErrors).length > 0) {
    setErrors(finalErrors);
    return;
  }

  setIsSubmitting(true);

  const toastId = toast.loading("Submitting your application...");

  try {
    const data = await submitBloodDriveApplication(formData);
    console.log("Server Response:", data);

    toast.success("Application submitted successfully!", { id: toastId });

    setShowSuccessModal(true);
    setIsSubmitted(true);

    setTimeout(() => {
      setFormData({
        organizationType: "",
        organizationName: "",
        contactPerson: "",
        designation: "",
        email: "",
        phone: "",
        alternatePhone: "",
        eventDate: "",
        eventTime: "",
        duration: "4",
        expectedDonors: "50",
        venue: "",
        address: "",
        city: "",
        pincode: "",
        requiredStaff: "2",
        equipment: ["mobile-blood-bank", "snacks"],
        specialRequirements: "",
        previousExperience: "no",
        targetGroup: "students",
        awarenessProgram: "yes",
        publicitySupport: "yes",
        termsAccepted: false,
      });

      setActiveStep(1);
      setIsSubmitted(false);
      setShowSuccessModal(false);
    }, 5000);

  } catch (error) {
    console.error("Submission error:", error);

    toast.error(
      error.response?.data?.message ||
        "Failed to submit application. Please try again.",
      { id: toastId }
    );

  } finally {
    setIsSubmitting(false);
  }
};

  // Render form steps
  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="form-step space-y-6 ">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaUniversity className="mr-3 text-pink-600" />
              Organization Details
            </h3>

            {/* Organization Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Type of Organization *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {organizationTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        organizationType: type.id,
                      }))
                    }
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.organizationType === type.id
                        ? `border-pink-500 bg-gradient-to-br ${type.color} text-white shadow-lg`
                        : "border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50"
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <span className="font-medium text-sm">{type.label}</span>
                  </button>
                ))}
              </div>
              {errors.organizationType && (
                <p className="text-red-500 text-sm mt-2">
                  ⚠️ {errors.organizationType}
                </p>
              )}
            </div>

            {/* Organization Name & Contact Person */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., ABC University"
                />
                {errors.organizationName && (
                  <p className="text-red-500 text-sm mt-1">
                    ⚠️ {errors.organizationName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Person *
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Person responsible"
                />
                {errors.contactPerson && (
                  <p className="text-red-500 text-sm mt-1">
                    ⚠️ {errors.contactPerson}
                  </p>
                )}
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="contact@organization.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">⚠️ {errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="9876543210"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">⚠️ {errors.phone}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-step space-y-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaCalendarAlt className="mr-3 text-pink-600" />
              Event Details
            </h3>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                {errors.eventDate && (
                  <p className="text-red-500 text-sm mt-1">
                    ⚠️ {errors.eventDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="eventTime"
                  value={formData.eventTime}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                {errors.eventTime && (
                  <p className="text-red-500 text-sm mt-1">
                    ⚠️ {errors.eventTime}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {[2, 3, 4, 5, 6, 7, 8].map((hours) => (
                    <option key={hours} value={hours}>
                      {hours} hours
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Venue Details */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Venue Name *
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="e.g., Main Auditorium, College Campus"
              />
              {errors.venue && (
                <p className="text-red-500 text-sm mt-1">⚠️ {errors.venue}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Complete Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Full address with landmarks"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">⚠️ {errors.address}</p>
              )}
            </div>

            {/* City & Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="City name"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">⚠️ {errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="6-digit pincode"
                />
                {errors.pincode && (
                  <p className="text-red-500 text-sm mt-1">
                    ⚠️ {errors.pincode}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-step space-y-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaUsers className="mr-3 text-pink-600" />
              Requirements & Expectations
            </h3>

            {/* Expected Donors */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expected Number of Donors *
                <span className="ml-2 text-gray-500 font-normal">
                  (Minimum 20)
                </span>
              </label>
              <div className="relative">
                <input
                  type="range"
                  name="expectedDonors"
                  value={formData.expectedDonors}
                  onChange={handleChange}
                  min="20"
                  max="500"
                  step="10"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>20</span>
                  <span>100</span>
                  <span>200</span>
                  <span>300</span>
                  <span>400</span>
                  <span>500</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-3xl font-bold text-pink-600">
                  {formData.expectedDonors}
                </span>
                <span className="text-gray-600 ml-2">expected donors</span>
              </div>
              {errors.expectedDonors && (
                <p className="text-red-500 text-sm mt-1">
                  ⚠️ {errors.expectedDonors}
                </p>
              )}
            </div>

            {/* Equipment Needed */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Equipment & Facilities Required
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  {
                    id: "mobile-blood-bank",
                    label: "Mobile Blood Bank Van",
                    icon: "🚐",
                  },
                  { id: "beds-chairs", label: "Beds/Chairs", icon: "🛏️" },
                  { id: "medical-staff", label: "Medical Staff", icon: "👩‍⚕️" },
                  { id: "snacks", label: "Snacks & Refreshments", icon: "🥪" },
                  { id: "sound-system", label: "Sound System", icon: "🔊" },
                  {
                    id: "promotional-material",
                    label: "Promotional Material",
                    icon: "📢",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleEquipmentChange(item.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.equipment.includes(item.id)
                        ? "border-pink-500 bg-pink-50 text-pink-700"
                        : "border-gray-200 bg-white hover:border-pink-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Special Requirements */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Any Special Requirements
              </label>
              <textarea
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Any specific requirements or arrangements needed..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form-step space-y-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaFileAlt className="mr-3 text-pink-600" />
              Final Details & Confirmation
            </h3>

            {/* Target Group */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Primary Target Group
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: "students", label: "Students", icon: "🎓" },
                  { id: "staff", label: "Staff", icon: "👨‍🏫" },
                  { id: "faculty", label: "Faculty", icon: "👩‍🔬" },
                  { id: "public", label: "General Public", icon: "👥" },
                ].map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        targetGroup: group.id,
                      }))
                    }
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.targetGroup === group.id
                        ? "border-pink-500 bg-pink-50 text-pink-700"
                        : "border-gray-200 bg-white hover:border-pink-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">{group.icon}</div>
                    <span className="font-medium text-sm">{group.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Awareness Program */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Would you like us to conduct an awareness program?
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      awarenessProgram: "yes",
                    }))
                  }
                  className={`relative flex-1 py-4 rounded-xl border-2 transition-all duration-500 ease-in-out overflow-hidden group ${
                    formData.awarenessProgram === "yes"
                      ? "border-green-500 bg-gradient-to-br from-green-50 to-green-100 text-green-700 shadow-lg shadow-green-500/20 scale-[1.02]"
                      : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/30 hover:shadow-md"
                  }`}
                >
                  {/* Shine effect for selected state */}
                  {formData.awarenessProgram === "yes" && (
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  )}

                  {/* Checkmark indicator for selected state */}
                  {formData.awarenessProgram === "yes" && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                  )}

                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl mb-1 transform group-hover:scale-110 transition-transform duration-300">
                      ✅
                    </span>
                    <span className="font-bold flex items-center">
                      Yes, Please
                      {formData.awarenessProgram === "yes" && (
                        <FaCheckCircle className="ml-2 text-green-500 animate-pulse" />
                      )}
                    </span>
                    {formData.awarenessProgram === "yes" && (
                      <span className="text-xs mt-1 text-green-600 font-medium animate-pulse">
                        Selected
                      </span>
                    )}
                  </div>

                  {/* Animated underline */}
                  {formData.awarenessProgram === "yes" && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, awarenessProgram: "no" }))
                  }
                  className={`relative flex-1 py-4 rounded-xl border-2 transition-all duration-500 ease-in-out overflow-hidden group ${
                    formData.awarenessProgram === "no"
                      ? "border-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 shadow-lg shadow-gray-500/20 scale-[1.02]"
                      : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50/30 hover:shadow-md"
                  }`}
                >
                  {/* Shine effect for selected state */}
                  {formData.awarenessProgram === "no" && (
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  )}

                  {/* Checkmark indicator for selected state */}
                  {formData.awarenessProgram === "no" && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                  )}

                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl mb-1 transform group-hover:scale-110 transition-transform duration-300">
                      ❌
                    </span>
                    <span className="font-bold flex items-center">
                      Not Required
                      {formData.awarenessProgram === "no" && (
                        <FaCheckCircle className="ml-2 text-gray-500 animate-pulse" />
                      )}
                    </span>
                    {formData.awarenessProgram === "no" && (
                      <span className="text-xs mt-1 text-gray-600 font-medium animate-pulse">
                        Selected
                      </span>
                    )}
                  </div>

                  {/* Animated underline */}
                  {formData.awarenessProgram === "no" && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full animate-pulse" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="mt-1 mr-3 h-5 w-5 text-pink-600 rounded focus:ring-pink-500"
                />
                <label htmlFor="termsAccepted" className="text-gray-700">
                  I agree to the{" "}
                  <a
                    href="#terms"
                    className="text-pink-600 hover:underline font-medium"
                  >
                    Terms & Conditions
                  </a>{" "}
                  and confirm that:
                  <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc list-inside">
                    <li>We will provide adequate space and basic facilities</li>
                    <li>We will promote the event among our members</li>
                    <li>We will coordinate with volunteers as needed</li>
                    <li>We understand this is subject to approval</li>
                  </ul>
                </label>
              </div>
              {errors.termsAccepted && (
                <p className="text-red-500 text-sm mt-2">
                  ⚠️ {errors.termsAccepted}
                </p>
              )}
            </div>

            {/* Review Summary */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-bold text-gray-800 mb-3">
                Application Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Organization:</strong> {formData.organizationName}
                </div>
                <div>
                  <strong>Contact:</strong> {formData.contactPerson}
                </div>
                <div>
                  <strong>Date:</strong> {formData.eventDate}
                </div>
                <div>
                  <strong>Time:</strong> {formData.eventTime}
                </div>
                <div>
                  <strong>Venue:</strong> {formData.venue}
                </div>
                <div>
                  <strong>Expected Donors:</strong> {formData.expectedDonors}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Success Modal
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 text-center">
        <div className="w-20 h-20 bg-pink_dark rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle className="text-white text-3xl" />
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          Application Submitted!
        </h3>

        <p className="text-gray-600 mb-6">
          Your blood drive application has been received. Our team will review
          it and contact you within 48 hours.
        </p>

        <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-4 mb-6">
          <p className="font-bold text-pink-700">
            Application ID: BD{Date.now().toString().slice(-6)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Keep this for future reference
          </p>
        </div>

        <button
          onClick={() => setShowSuccessModal(false)}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-bold transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );

  return (
    <WrapperSection>
      <div className="host-blood-drive-wrapper bg-gradient-to-br from-pink-300 via-pink-200 to-pink-100 md:-mt-[480px] -mt-[670px] rounded-3xl p-4 sm:p-8 lg:p-12 shadow-2xl shadow-pink-500/10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            <span className="text-pink-600">Host a</span> Blood Drive
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Schools, colleges, corporates & clubs can organize blood donation
            camps. Our team will coordinate everything from approval to
            execution.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Info & Benefits */}
          <div className="lg:w-2/5">
            {/* Benefits Card */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaCheckCircle className="mr-3 text-pink-600" />
                Why Host With Us?
              </h3>
              <ul className="space-y-3">
                {[
                  "Complete medical team & equipment provided",
                  "Promotional material & awareness programs",
                  "Certificates for donors & organizers",
                  "Insurance coverage for all participants",
                  "Post-camp feedback & impact report",
                  "Media coverage opportunities",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-pink-500 mr-2">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Upcoming Camps */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaCalendarCheck className="mr-3 text-pink-600" />
                Upcoming Blood Drives
              </h3>



















              <div className="space-y-4">
                {camp.map((camp) => {
  const orgUI = organizationTypeUI[camp.organizationType];

  return (
    <div
      key={camp._id}
      className="flex items-start p-3 bg-gray-50 rounded-xl"
    >
      {/* Status Badge */}
      <div
        className={`px-3 py-1 rounded-full text-xs font-bold mr-3 ${statusUI[camp.status]}`}
      >
        {camp.status}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
          <span className={`p-1 rounded ${orgUI.badge}`}>
            {orgUI.icon}
          </span>
          {camp.organizationName}
        </h4>

        <div className="flex items-center text-xs text-gray-600 mt-1">
          <FaCalendarAlt className="mr-1" />
          {new Date(camp.eventDate).toLocaleDateString()} •{" "}
          {camp.expectedDonors} donors
        </div>

        <div className="text-xs text-gray-500 mt-1">
          {camp.venue}
        </div>
      </div>
    </div>
  );
})}
              </div>

              <div className="mt-6 text-center">
                <button className="text-pink-600 hover:text-pink-700 font-medium flex items-center justify-center mx-auto">
                  <FaChartLine className="mr-2" />
                  View Impact Report
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-pink-600">150+</div>
                <div className="text-sm text-gray-600">Camps Organized</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-pink-600">5K+</div>
                <div className="text-sm text-gray-600">Lives Saved</div>
              </div>
            </div>
          </div>

          {/* Right Side - Application Form */}
          <div className="lg:w-3/5">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                        activeStep >= step
                          ? "bg-pink-600 text-white shadow-lg"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step}
                    </div>
                    <span className="text-xs mt-2 text-gray-600 hidden sm:block">
                      {step === 1 && "Organization"}
                      {step === 2 && "Event Details"}
                      {step === 3 && "Requirements"}
                      {step === 4 && "Confirmation"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-pink-600 transition-all duration-500"
                  style={{ width: `${((activeStep - 1) / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Form Content */}
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6"
            >
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={activeStep === 1}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                {activeStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl font-bold transition-all hover:shadow-lg"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-pink_second_dark text-white rounded-xl font-bold transition-all hover:shadow-lg flex items-center disabled:opacity-70 hover:bg-pink_dark"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin mr-3" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-3" />
                        Submit Application
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Step Indicator */}
              <div className="text-center mt-4 text-sm text-gray-500">
                Step {activeStep} of 4
              </div>
            </form>

            {/* Quick Info */}
            <div className="mt-6 bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-2xl p-4 sm:p-6">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                <FaClock className="mr-2 text-pink-600" />
                What happens next?
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                <div className="text-center">
                  <div className="text-2xl mb-1">1️⃣</div>
                  <div className="text-sm font-medium">Application Review</div>
                  <div className="text-xs text-gray-600">Within 48 hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">2️⃣</div>
                  <div className="text-sm font-medium">
                    Site Visit & Planning
                  </div>
                  <div className="text-xs text-gray-600">Coordination call</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">3️⃣</div>
                  <div className="text-sm font-medium">Camp Execution</div>
                  <div className="text-xs text-gray-600">
                    Full support provided
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccessModal && <SuccessModal />}
      </div>
    </WrapperSection>
  );
};

export default HostBloodDrive;
