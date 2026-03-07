import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
  FiMessageCircle,
  FiImage,
  FiSettings,
  FiHelpCircle,
  FiPieChart,
  FiDroplet, // Added for Donation Management
} from "react-icons/fi";
import logo from "../../../public/HemoCell Logo black.png";
import "./sidebar.scss";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin-login");
  };

  return (
    <>
      <div className="mobile-header">
        <button className="menu-toggle-btn" onClick={() => setIsOpen(true)}>
          <FiMenu />
        </button>
        <Link to="/admin" className="mobile-logo">
          <img src={logo} alt="HemoCell" />
        </Link>
      </div>
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>
      )}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/admin" className="logo">
            <img src={logo} alt="HemoCell" />
            <span>HemoCell</span>
          </Link>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <FiX />
          </button>
        </div>
        <div className="admin-info">
          <div className="admin-avatar">
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=dc2626&color=fff&size=48"
              alt="Admin"
            />
          </div>
          <div className="admin-details">
            <h4>Admin User</h4>
            <p>Administrator</p>
          </div>
          <div className="notification-icon">
            <FiBell />
            <span className="badge">5</span>
          </div>
        </div>

        <div className="nav-menu">
          <Link
            to="/admin"
            className={`nav-item ${currentPath === "/admin" ? "active" : ""}`}
          >
            <FiHome className="nav-icon" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/user-management"
            className={`nav-item ${currentPath.includes("user-management") ? "active" : ""}`}
          >
            <FiUsers className="nav-icon" />
            <span>User Management</span>
          </Link>

          {/* Donation Management - New Item */}
          <Link
            to="/admin/donation-management"
            className={`nav-item ${currentPath.includes("donation-management") ? "active" : ""}`}
          >
            <FiDroplet className="nav-icon" />
            <span>Donation Management</span>
          </Link>

          <Link
            to="/admin/camp-management"
            className={`nav-item ${currentPath.includes("camp-management") ? "active" : ""}`}
          >
            <FiCalendar className="nav-icon" />
            <span>Camp Management</span>
          </Link>

          <Link
            to="/admin/gallery-management"
            className={`nav-item ${currentPath.includes("gallery-management") ? "active" : ""}`}
          >
            <FiImage className="nav-icon" />
            <span>Gallery Management</span>
          </Link>

          <Link
            to="/admin/contact-management"
            className={`nav-item ${currentPath.includes("contact-management") ? "active" : ""}`}
          >
            <FiMessageCircle className="nav-icon" />
            <span>Contact Management</span>
          </Link>

          <Link
            to="/admin/reports"
            className={`nav-item ${currentPath.includes("/admin/reports") ? "active" : ""}`}
          >
            <FiPieChart className="nav-icon" />
            <span>Reports</span>
          </Link>

          <Link
            to="/admin/settings"
            className={`nav-item ${currentPath === "/admin/settings" ? "active" : ""}`}
          >
            <FiSettings className="nav-icon" />
            <span>Settings</span>
          </Link>

          <Link
            to="/admin/help"
            className={`nav-item ${currentPath === "/admin/help" ? "active" : ""}`}
          >
            <FiHelpCircle className="nav-icon" />
            <span>Help</span>
          </Link>
        </div>
        
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>

        <div className="version">v2.0.0</div>
      </div>
    </>
  );
}