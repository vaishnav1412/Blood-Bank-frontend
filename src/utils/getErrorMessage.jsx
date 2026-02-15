export const getErrorMessage = (err) => {
  const status = err.response?.status;

  if (status === 401) return "Invalid email or password.";
  if (status === 404) return "User not found.";
  if (status >= 500) return "Server error. Please try again later.";

  return err.response?.data?.message || "Login failed. Please try again.";
};