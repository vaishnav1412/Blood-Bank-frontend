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