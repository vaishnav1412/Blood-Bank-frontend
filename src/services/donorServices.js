import axiosInstance from "../api/axiosInstance";
import { publicAxios } from "../api/publicInstance";


export const loginDonor = async (email, password) => {
  const response = await axiosInstance.post("/doner/login", {
    email: email.trim(),
    password,
  });

  return response.data;
};

export const getDonorInfo = async () => {
  const response = await axiosInstance.post("/doner/get-user-info");

  return response.data.user;
};

export const registerDonor = async (formData) => {
  const response = await axiosInstance.post("/doner/doner-register", formData);

  return response.data;
};


// Send OTP for password reset
export const sendForgotOtp = async (email) => {
  const response = await axiosInstance.post("/doner/send-otp", {
    email,
    purpose: "password_reset",
  });

  return response.data;
};

// Verify OTP
export const verifyForgotOtp = async (email, otp) => {
  const response = await axiosInstance.post("/doner/verify-forgot-otp", {
    email,
    otp,
  });

  return response.data;
};

// Resend OTP
export const resendForgotOtp = async (email) => {
  const response = await axiosInstance.post("/doner/resend-otp", {
    email,
  });

  return response.data;
};

// Reset Password
export const resetForgotPassword = async ({ userId, email, otp, newPassword }) => {
  const response = await axiosInstance.post("/doner/reset-password", {
    userId,
    email,
    otp,
    newPassword,
  });

  return response.data;
};

//-------------camp--------------

export const submitBloodDriveApplication = async (formData) => {
  const response = await publicAxios.post(
    "/doner/applicationSubmission",
    formData
  );

  return response.data; // always return only backend data
};

//fetch all campdetails using public axios
export const fetchAllCampRequests = async () => {
  const response = await publicAxios.get("/doner/getAllCamps");

  return response.data;

};

//-------------------------------------------


export const sendContactMessage = (data) => {
  return publicAxios.post("/doner/contact", data);
};

export const searchDonors = async (filters = {}) => {
  const response = await publicAxios.get("/doner/search-user", {
    params: filters,
  });

  return response.data;
};

export const updateDonorProfile = async (updatedData) => {
  const response = await axiosInstance.put(
    "/doner/update-profile",
    updatedData
  );

  return response.data;
};

export const deleteDonorAccount = async () => {
  const response = await axiosInstance.delete("/doner/delete-account");
  return response.data;
};

export const updateHealthStatus = async (healthData) => {
  const response = await axiosInstance.post(
    "/doner/healthStatus",
    healthData
  );

  return response.data;
};

export const getDonorProfileDetails = async () => {
  const response = await axiosInstance.get("/doner/profile-details");
  return response.data;
};

export const uploadProfilePhoto = async (formData) => {
  const response = await axiosInstance.put(
    "/doner/profile-photo",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const uploadDonationProof = async (formData) => {
  const response = await axiosInstance.post(
    "/doner/upload-proof",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const removeProfilePhoto = async () => {
  const response = await axiosInstance.delete("/doner/profile-photo");
  return response.data;
};


// Fetch Donation History
export const fetchDonationHistory = async () => {
  const response = await axiosInstance.get("/doner/donation-history");
  return response.data;
};


export const deleteDonationProof = async (donationId) => {
  const { data } = await axiosInstance.delete(
    `/doner/delete-proof/${donationId}`
  );

  return data;
};