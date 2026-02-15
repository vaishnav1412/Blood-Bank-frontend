import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/donor-profile" replace />;
  }

  return children;
};


PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
