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