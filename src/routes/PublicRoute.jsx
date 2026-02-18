import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const donor = localStorage.getItem("donor");

  // Redirect only if user is truly logged in
  if (token && donor) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
