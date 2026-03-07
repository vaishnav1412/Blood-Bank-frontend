import adminAxiosInstance from "../api/adminInstance";
import adminPublicAxios from "../api/adminInstancePublic";


export const loginAdmin = async (email, password) => {
  const response = await adminPublicAxios.post("/admin/login", {
    email: email.trim(),
    password,
  });

  return response.data; // { adminToken, admin }
};
 
//count for login page
export const fetchCount = async () => {
  const response = await adminPublicAxios.get("/admin/get-count");
  return response.data;
};

export const fetchBloodGroupCount = async () => {
  const response = await adminPublicAxios.get("/admin/blood-group-count");
  return response.data.stats;
};

export const fetchDashboardStats = async () => {
  const response = await adminPublicAxios.get("/admin/dashboard-stats");
  return response.data;
};

export const fetchAllUsers = async (params = {}) => {
  const response = await adminPublicAxios.get("/admin/get-all-users", {
    params,
  });

  return response.data.users;
};


export const blockUser = async (userId, blockReason) => {
  const response = await adminPublicAxios.post("/admin/block-user", {
    userId,
    blockReason,
  });

  return response.data;
};

export const unblockUser = async (userId) => {
  const response = await adminPublicAxios.post("/admin/unblock-user", {
    userId,
  });

  return response.data;
};

export const addDonor = async (formData) => {
  const response = await adminPublicAxios.post(
    "/admin/add-donor",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const uploadGalleryMedia = async (data) => {
  const response = await adminPublicAxios.post(
    "/admin/upload-gallery",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const getGalleryItems = async () => {
  const response = await adminPublicAxios.get("/admin/gallery-items");
  return response.data;
};


export const updateGalleryMedia = async (id, formData) => {
  console.log("its okay",id,formData);
  
  const response = await adminPublicAxios.put(
    `/admin/update-gallery/${id}`,
    formData
  );

  return response.data;
};

export const deleteGalleryMedia = async (id) => {
  const response = await adminPublicAxios.delete(
    `/admin/delete-gallery/${id}`
  );

  return response.data;
};


export const getContactMessages = async () => {
  const response = await adminPublicAxios.get("/admin/contact-messages");
  return response.data;
};


export const deleteContactMessages = async (ids) => {
  const response = await adminPublicAxios.delete(
    "/admin/delete-contacts",
    {
      data: { ids }, // IMPORTANT: send body in DELETE like this
    }
  );

  return response.data;
};

export const updateContactStatus = async (id, status) => {
  const response = await adminPublicAxios.patch(
    `/admin/update-contact-status/${id}`,
    { status }
  );

  return response.data;
};

export const replyToContact = async (id, replyMessage) => {
  const response = await adminAxiosInstance.put(
    `/admin/contact-reply/${id}`,
    { replyMessage }
  );

  return response.data;
};

export const getAllDonations = async () => {
  const response = await adminPublicAxios.get("/admin/donations");
  return response.data;
};

export const rejectDonation = async (donationId, reason) => {
  const response = await adminPublicAxios.put(`/admin/donations/${donationId}`, {
    status: "rejected",
    adminRemarks: reason,
  });

  return response.data;
};

export const verifyDonation = async (donationId) => {
  const response = await adminPublicAxios.put(`/admin/donations/${donationId}`, {
    status: "verified",
    adminRemarks: "Verified by admin",
  });

  return response.data;
};