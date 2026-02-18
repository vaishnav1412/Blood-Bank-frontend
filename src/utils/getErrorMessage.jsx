export const getErrorMessage = (err) => {
  const status = err.response?.status;

  // ✅ Backend message (highest priority)
  if (err.response?.data?.message) {
    return err.response.data.message;
  }

  // ✅ Common HTTP Errors
  if (status === 400) return "Invalid request. Please check your input.";
  if (status === 401) return "Unauthorized. Please login again.";
  if (status === 403) return "Access denied.";
  if (status === 404) return "Requested resource not found.";
  if (status >= 500) return "Server error. Please try again later.";

  // ✅ Network error
  if (err.message === "Network Error") {
    return "Network error. Please check your internet connection.";
  }

  // ✅ Default fallback
  return "Something went wrong. Please try again.";
};
