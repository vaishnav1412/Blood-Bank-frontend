export const validateDonorRegisterForm = (formData) => {
  const newErrors = {};

  if (!formData.name.trim()) newErrors.name = "Name is required";
  if (!formData.gender) newErrors.gender = "Gender is required";
  if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group is required";
  if (!formData.dob) newErrors.dob = "Date of birth is required";

  if (!formData.weight || formData.weight < 50) {
    newErrors.weight = "Weight must be at least 50 kg";
  }

  if (!formData.platelet) {
    newErrors.platelet = "Platelet willingness is required";
  }

  if (!formData.donationCount) {
    newErrors.donationCount = "Donation count is required";
  }

  if (!formData.taluk) newErrors.taluk = "Taluk is required";
  if (!formData.district) newErrors.district = "District is required";

  // Mobile validation
  const mobileRegex = /^[6-9]\d{9}$/;

  if (!formData.mobile || !mobileRegex.test(formData.mobile)) {
    newErrors.mobile = "Invalid mobile number";
  }

  if (!formData.whatsapp || !mobileRegex.test(formData.whatsapp)) {
    newErrors.whatsapp = "Invalid WhatsApp number";
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formData.email || !emailRegex.test(formData.email)) {
    newErrors.email = "Invalid email address";
  }

  if (formData.email !== formData.reEmail) {
    newErrors.reEmail = "Emails do not match";
  }

  if (!formData.agreeToPolicy) {
    newErrors.agreeToPolicy = "You must agree to the policy.";
  }

  return newErrors;
};
