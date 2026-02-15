import axiosInstance from "../api/axiosInstance";

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
