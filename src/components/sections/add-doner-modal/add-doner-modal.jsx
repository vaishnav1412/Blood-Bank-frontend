import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiXCircle,
  FiCheckCircle,
  FiUpload,
  FiUserCheck,
  FiLock,
  FiEye,
  FiEyeOff,
  FiRefreshCw,
  FiDroplet,
} from "react-icons/fi";
import { FaTint, FaWhatsapp } from "react-icons/fa";
import "./add-doner-modal.scss";
import { addDonor } from "../../../services/adminServices";

const AddDonorModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    mobile: "",
    whatsapp: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    
    // Address Information
    district: "",
    taluk: "",
    
    // Blood Information
    bloodGroup: "",
    weight: "",
    platelet: "",
    
    // Donation Information
    donationCount: 0,
    latestDonatedDate: "",
    
    // Document Upload
    profilePic: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const genders = ["Male", "Female", "Other"];
  const plateletOptions = ["Yes", "No"];

  // Validation function based on schema
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/.+\@.+\..+/.test(formData.email)) {
        newErrors.email = "Enter valid email address";
      }
      
      if (!formData.mobile.trim()) {
        newErrors.mobile = "Mobile number is required";
      } else if (!/^\d{10}$/.test(formData.mobile)) {
        newErrors.mobile = "Mobile number must be 10 digits";
      }
      
      if (!formData.whatsapp.trim()) {
        newErrors.whatsapp = "WhatsApp number is required";
      } else if (!/^\d{10}$/.test(formData.whatsapp)) {
        newErrors.whatsapp = "WhatsApp number must be 10 digits";
      }
      
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      
      if (!formData.dob) newErrors.dob = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
    }

    if (step === 2) {
      if (!formData.district.trim()) newErrors.district = "District is required";
      if (!formData.taluk.trim()) newErrors.taluk = "Taluk is required";
    }

    if (step === 3) {
      if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group is required";
      if (!formData.weight) {
        newErrors.weight = "Weight is required";
      } else if (formData.weight < 40) {
        newErrors.weight = "Minimum weight must be 40kg";
      }
      if (!formData.platelet) newErrors.platelet = "Platelet donation preference is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === "donationCount") {
      // Ensure donationCount is a number
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all steps
    const isStep1Valid = validateStep(1);
    const isStep2Valid = validateStep(2);
    const isStep3Valid = validateStep(3);

    if (!isStep1Valid || !isStep2Valid || !isStep3Valid) {
      if (!isStep1Valid) setCurrentStep(1);
      else if (!isStep2Valid) setCurrentStep(2);
      else if (!isStep3Valid) setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const submitData = new FormData();

      // Append all fields according to schema
      const fieldsToSend = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        whatsapp: formData.whatsapp,
        password: formData.password,
        dob: formData.dob,
        gender: formData.gender,
        district: formData.district,
        taluk: formData.taluk,
        bloodGroup: formData.bloodGroup,
        weight: formData.weight,
        platelet: formData.platelet,
        donationCount: formData.donationCount || 0,
      };

      // Add latestDonatedDate only if provided
      if (formData.latestDonatedDate) {
        fieldsToSend.latestDonatedDate = formData.latestDonatedDate;
      }

      // Append all fields to FormData
      Object.keys(fieldsToSend).forEach((key) => {
        if (fieldsToSend[key] !== null && fieldsToSend[key] !== "") {
          submitData.append(key, fieldsToSend[key]);
        }
      });

      // Append profile picture if exists
      if (formData.profilePic) {
        submitData.append("profilePic", formData.profilePic);
      }

      const response = await addDonor(submitData);

      if (response.success) {
        // Reset form after success
        setFormData({
          name: "",
          email: "",
          mobile: "",
          whatsapp: "",
          password: "",
          confirmPassword: "",
          dob: "",
          gender: "",
          district: "",
          taluk: "",
          bloodGroup: "",
          weight: "",
          platelet: "",
          donationCount: 0,
          latestDonatedDate: "",
          profilePic: null,
        });

        onSuccess?.();   // refresh parent list
        onClose();       // close modal

      } else {
        setErrors({
          submit: response.message || "Failed to add donor",
        });
      }

    } catch (error) {
      console.error("Add Donor Error:", error);
      setErrors({
        submit: error.response?.data?.message || "Failed to add donor. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="form-step">
      <h3>Personal Information</h3>
      <div className="form-grid">
        <div className="form-group full-width">
          <label>
            <FiUser /> Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>
            <FiMail /> Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>
            <FiPhone /> Mobile *
          </label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="10 digit mobile number"
            maxLength="10"
            className={errors.mobile ? "error" : ""}
          />
          {errors.mobile && <span className="error-message">{errors.mobile}</span>}
        </div>

        <div className="form-group">
          <label>
            <FaWhatsapp /> WhatsApp *
          </label>
          <input
            type="tel"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="10 digit WhatsApp number"
            maxLength="10"
            className={errors.whatsapp ? "error" : ""}
          />
          {errors.whatsapp && <span className="error-message">{errors.whatsapp}</span>}
        </div>

        <div className="form-group">
          <label>
            <FiLock /> Password *
          </label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className={errors.password ? "error" : ""}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>
            <FiLock /> Confirm Password *
          </label>
          <div className="password-input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className={errors.confirmPassword ? "error" : ""}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <div className="form-group">
          <label>
            <FiCalendar /> Date of Birth *
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            className={errors.dob ? "error" : ""}
          />
          {errors.dob && <span className="error-message">{errors.dob}</span>}
        </div>

        <div className="form-group">
          <label>Gender *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={errors.gender ? "error" : ""}
          >
            <option value="">Select Gender</option>
            {genders.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {errors.gender && <span className="error-message">{errors.gender}</span>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-step">
      <h3>Address Information</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>
            <FiMapPin /> District *
          </label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="Enter district"
            className={errors.district ? "error" : ""}
          />
          {errors.district && <span className="error-message">{errors.district}</span>}
        </div>

        <div className="form-group">
          <label>
            <FiMapPin /> Taluk *
          </label>
          <input
            type="text"
            name="taluk"
            value={formData.taluk}
            onChange={handleChange}
            placeholder="Enter taluk"
            className={errors.taluk ? "error" : ""}
          />
          {errors.taluk && <span className="error-message">{errors.taluk}</span>}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="form-step">
      <h3>Blood & Medical Information</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>
            <FaTint /> Blood Group *
          </label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className={errors.bloodGroup ? "error" : ""}
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
          {errors.bloodGroup && <span className="error-message">{errors.bloodGroup}</span>}
        </div>

        <div className="form-group">
          <label>Weight (kg) *</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Enter weight in kg"
            min="40"
            max="200"
            step="0.1"
            className={errors.weight ? "error" : ""}
          />
          {errors.weight && <span className="error-message">{errors.weight}</span>}
        </div>

        <div className="form-group">
          <label>
            <FiDroplet /> Platelet Donation *
          </label>
          <select
            name="platelet"
            value={formData.platelet}
            onChange={handleChange}
            className={errors.platelet ? "error" : ""}
          >
            <option value="">Select Option</option>
            {plateletOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errors.platelet && <span className="error-message">{errors.platelet}</span>}
        </div>

        <div className="form-group">
          <label>Donation Count</label>
          <input
            type="number"
            name="donationCount"
            value={formData.donationCount}
            onChange={handleChange}
            placeholder="Number of previous donations"
            min="0"
            className={errors.donationCount ? "error" : ""}
          />
        </div>

        <div className="form-group">
          <label>Last Donation Date</label>
          <input
            type="date"
            name="latestDonatedDate"
            value={formData.latestDonatedDate}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="form-group">
          <label>
            <FiUpload /> Profile Photo
          </label>
          <input
            type="file"
            name="profilePic"
            onChange={handleChange}
            accept=".jpg,.jpeg,.png"
          />
          <small>Upload profile picture (optional)</small>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content add-donor-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>
            <FiUserCheck className="modal-icon" />
            Add New Donor
          </h3>
          <button className="close-btn" onClick={onClose} disabled={isSubmitting}>
            <FiXCircle />
          </button>
        </div>

        <div className="modal-body">
          {/* Progress Steps */}
          <div className="progress-steps">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`step ${currentStep >= step ? "active" : ""} ${
                  currentStep > step ? "completed" : ""
                }`}
                onClick={() => !isSubmitting && setCurrentStep(step)}
              >
                <div className="step-number">{step}</div>
                <div className="step-label">
                  {step === 1 && "Personal"}
                  {step === 2 && "Address"}
                  {step === 3 && "Medical"}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {errors.submit && (
              <div className="submit-error">{errors.submit}</div>
            )}

            {/* Navigation Buttons */}
            <div className="form-navigation">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="prev-btn"
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                >
                  Previous
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  className="next-btn"
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FiRefreshCw className="spinning" />
                      Adding Donor...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle />
                      Add Donor
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDonorModal;