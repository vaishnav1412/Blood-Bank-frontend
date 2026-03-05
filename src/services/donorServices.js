import axiosInstance from "../api/axiosInstance";
import { publicAxios } from "../api/publicInstance";


export const loginDonor = async (email, password) => {
  const response = await axiosInstance.post("/donor/auth/login", {
    email: email.trim(),
    password,
  });

  return response.data;
};

export const registerDonor = async (formData) => {
  const response = await axiosInstance.post("/donor/auth/register", formData);

  return response.data;
};

export const verifyRegisterOtp = async (email, otp) => {
  const { data } = await publicAxios.post("/donor/auth/verify-otp", {
    email,
    otp,
  });

  return data;
};

export const resendRegisterOtp = async (email) => {
  const { data } = await publicAxios.post("/donor/auth/resend-otp", {
    email,
  });

  return data;
};

export const sendForgotOtp = async (email) => {
  const response = await axiosInstance.post("/donor/auth/forgot-password/send-otp", {
    email,
    purpose: "password_reset",
  });

  return response.data;
};

export const verifyForgotOtp = async (email, otp) => {
  const response = await axiosInstance.post("donor/auth/forgot-password/verify-otp", {
    email,
    otp,
  });

  return response.data;
};

export const resetForgotPassword = async ({ userId, email, otp, newPassword }) => {
  const response = await axiosInstance.post("/donor/auth/reset-password", {
    userId,
    email,
    otp,
    newPassword,
  });

  return response.data;
};


export const getDonorInfo = async () => {
  const response = await axiosInstance.get("/donor/profile/me");

  return response.data.user;
};

//-------------camp--------------

export const submitBloodDriveApplication = async (formData) => {
  const response = await publicAxios.post(
    "/donor/camps/apply",
    formData
  );

  return response.data;
};

export const fetchAllCampRequests = async () => {
  const response = await publicAxios.get("/donor/camps");

  return response.data;

};

//-------------------------------------------


export const sendContactMessage = (data) => {
  return publicAxios.post("/donor/contact", data);
};

export const sendContactMessagePrivate = (data) => {
  return axiosInstance.post("/donor/contact/private", data);
};

export const getMyContactHistory = async () => {
  const response = await axiosInstance.get("/donor/contact/history");
  return response.data;
};

export const updateDonorProfile = async (updatedData) => {
  const response = await axiosInstance.put(
    "/donor/profile",
    updatedData
  );

  return response.data;
};

export const deleteDonorAccount = async () => {
  const response = await axiosInstance.delete("/donor/profile");
  return response.data;
};

export const updateHealthStatus = async (healthData) => {
  const response = await axiosInstance.post(
    "/donor/profile/health-status",
    healthData
  );

  return response.data;
};

export const getDonorProfileDetails = async () => {
  const response = await axiosInstance.get("/donor/profile");
  return response.data;
};

export const uploadProfilePhoto = async (formData) => {
  const response = await axiosInstance.put(
    "/donor/profile/photo",
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
  const response = await axiosInstance.delete("/donor/profile/photo");
  return response.data;
};


export const uploadDonationProof = async (formData) => {
  const response = await axiosInstance.post(
    "/donor/donations/proof",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const fetchDonationHistory = async () => {
  const response = await axiosInstance.get("/donor/donations/history");
  return response.data;
};

export const deleteDonationProof = async (donationId) => {
  const { data } = await axiosInstance.delete(
    `/donor/donations/proof${donationId}`
  );

  return data;
};

export const searchDonors = async (filters = {}) => {
  const response = await publicAxios.get("/donor/donations/search", {
    params: filters,
  });

  return response.data;
};


