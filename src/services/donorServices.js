import axiosInstance from "../api/axiosInstance";
import { publicAxios } from "../api/publicInstance";

export const loginDonor = async (email, password) => {
  const response = await axiosInstance.post("/api/v1/donor/auth/login", {
    email: email.trim(),
    password,
  });

  return response.data;
};

export const registerDonor = async (formData) => {
  const response = await axiosInstance.post("/api/v1/donor/auth/register", formData);

  return response.data;
};

export const verifyRegisterOtp = async (email, otp) => {
  const { data } = await publicAxios.post("/api/v1/donor/auth/verify-otp", {
    email,
    otp,
  });

  return data;
};

export const resendRegisterOtp = async (email) => {
  const { data } = await publicAxios.post("/api/v1/donor/auth/resend-otp", {
    email,
  });

  return data;
};

export const sendForgotOtp = async (email) => {
  const response = await axiosInstance.post("/api/v1/donor/auth/forgot-password/send-otp", {
    email,
    purpose: "password_reset",
  });

  return response.data;
};

export const verifyForgotOtp = async (email, otp) => {
  const response = await axiosInstance.post("/api/v1/donor/auth/forgot-password/verify-otp", {
    email,
    otp,
  });

  return response.data;
};

export const resetForgotPassword = async ({ userId, email, otp, newPassword }) => {
  const response = await axiosInstance.post("/api/v1/donor/auth/reset-password", {
    userId,
    email,
    otp,
    newPassword,
  });

  return response.data;
};


export const getDonorInfo = async () => {
  const response = await axiosInstance.get("/api/v1/donor/profile/me");

  return response.data.user;
};

//-------------camp--------------

export const submitBloodDriveApplication = async (formData) => {
  const response = await publicAxios.post(
    "/api/v1/donor/camps/apply",
    formData
  );

  return response.data;
};

export const fetchAllCampRequests = async () => {
  const response = await publicAxios.get("/api/v1/donor/camps");

  return response.data;

};

//---------------------contact us-----------------------


export const sendContactMessage = (data) => {
  return publicAxios.post("/api/v1/donor/contact", data);
};

export const sendContactMessagePrivate = (data) => {
  return axiosInstance.post("/api/v1/donor/contact/private", data);
};

export const getMyContactHistory = async () => {
  const response = await axiosInstance.get("/api/v1/donor/contact/history");
  return response.data;
};

//--------------------doner profile---------------------------------


export const updateDonorProfile = async (updatedData) => {
  const response = await axiosInstance.put(
    "/api/v1/donor/profile",
    updatedData
  );
  return response.data;
};

export const deleteDonorAccount = async () => {
  const response = await axiosInstance.delete("/api/v1/donor/profile");
  return response.data;
};

export const updateHealthStatus = async (healthData) => {
  const response = await axiosInstance.post(
    "/api/v1/donor/profile/health-status",
    healthData
  );
  return response.data;
};

export const getDonorProfileDetails = async () => {
  const response = await axiosInstance.get("/api/v1/donor/profile");
  return response.data;
};

export const uploadProfilePhoto = async (formData) => {
  const response = await axiosInstance.put(
    "/api/v1/donor/profile/photo",
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
  const response = await axiosInstance.delete("/api/v1/donor/profile/photo");
  return response.data;
};


export const uploadDonationProof = async (formData) => {
  const response = await axiosInstance.post(
    "/api/v1/donor/donations/proof",
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
  const response = await axiosInstance.get("/api/v1/donor/donations/history");
  return response.data;
};

export const deleteDonationProof = async (donationId) => {
  const { data } = await axiosInstance.delete(
    `/api/v1/donor/donations/proof${donationId}`
  );
  return data;
};


//------------------------need blood part----------------------------


export const searchDonors = async (filters = {}) => {
  const response = await publicAxios.get("/api/v1/donor/donations/search", {
    params: filters,
  });
  return response.data;
};


//----------------------------gallery part------------------------------


export const getGalleryItems = async () => {
  const res = await publicAxios.get("/api/v1/donor/gallery");
  return res.data;
};


export const likeGalleryItem = async (id) => {
  const res = await axiosInstance.patch(`/api/v1/donor/gallery/like/${id}`);
  return res.data;
};

export const commentOnItem = async (id, text) => {
  const res = await axiosInstance.post(`/api/v1/donor/gallery/comment/${id}`, {
    text
  });
  return res.data;
};

//------------------------------------------------------------------------