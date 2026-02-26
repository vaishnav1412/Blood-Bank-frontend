import { Link } from "react-router-dom";
import "./not-found.scss";

export default function NotFound() {
  // Check authentication
  const token = localStorage.getItem("token");

  // Dynamic routes
  const homeRoute = token ? "/home" : "/";
  const contactRoute = token ? "/contact-private" : "/contact";

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>

        <h2 className="not-found-subtitle">
          Oops! Page Not Found
        </h2>

        <p className="not-found-text">
          The page you are looking for might have been removed,
          renamed, or is temporarily unavailable.
        </p>

        <div className="not-found-actions">
          {/* Dynamic Home */}
          <Link to={homeRoute} className="not-found-link home-link">
            {token ? "Go to Dashboard" : "Go to Homepage"}
          </Link>

          {/* Dynamic Contact */}
          <Link to={contactRoute} className="not-found-link contact-link">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}