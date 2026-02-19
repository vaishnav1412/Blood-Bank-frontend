import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { 
  FiHome, 
  FiUsers, 
  FiDroplet, 
  FiCalendar, 
  FiAward, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
  FiClock,
  FiCheckCircle,
  FiUserPlus,
  FiAlertCircle,
  FiChevronDown,
  FiChevronRight,
  FiPieChart,
  FiMessageCircle,
  FiHelpCircle,
  FiImage 
} from "react-icons/fi";
import logo from "../../../public/HemoCell Logo black.png";
import "./sidebar.scss";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin-login");
  };

  const donorMenus = [
    { name: "All Donors", path: "/admin/donors/all", icon: <FiUsers />, count: 245 },
    { name: "Pending Verification", path: "/admin/donors/pending", icon: <FiClock />, count: 12 },
    { name: "Verified Donors", path: "/admin/donors/verified", icon: <FiCheckCircle />, count: 218 },
    { name: "Add New Donor", path: "/admin/donors/add", icon: <FiUserPlus /> }
  ];

  const requestMenus = [
    { name: "All Requests", path: "/admin/requests/all", icon: <FiDroplet />, count: 89 },
    { name: "Urgent Requests", path: "/admin/requests/urgent", icon: <FiAlertCircle />, count: 23 },
    { name: "Pending", path: "/admin/requests/pending", icon: <FiClock />, count: 45 }
  ];

  const galleryMenus = [
    { name: "All Images", path: "/admin/gallery/all", icon: <FiImage />, count: 156 },
    { name: "Donation Drives", path: "/admin/gallery/drives", icon: <FiCalendar />, count: 45 },
    { name: "Volunteers", path: "/admin/gallery/volunteers", icon: <FiUsers />, count: 32 },
    { name: "Awards", path: "/admin/gallery/awards", icon: <FiAward />, count: 28 },
    { name: "Events", path: "/admin/gallery/events", icon: <FiCalendar />, count: 34 },
    { name: "Upload New", path: "/admin/gallery/upload", icon: <FiImage />, highlight: true }
  ];

  return (
    <>
      {/* Mobile Header - Visible only on mobile */}
      <div className="mobile-header">
        <button className="menu-toggle-btn" onClick={() => setIsOpen(true)}>
          <FiMenu />
        </button>
        <Link to="/admin/dashboard" className="mobile-logo">
          <img src={logo} alt="HemoCell" />
        </Link>
      </div>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="sidebar-header">
          <Link to="/admin/dashboard" className="logo">
            <img src={logo} alt="HemoCell" />
            <span>HemoCell</span>
          </Link>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <FiX />
          </button>
        </div>

        {/* Admin Info */}
        <div className="admin-info">
          <div className="admin-avatar">
            <img src="https://ui-avatars.com/api/?name=Admin&background=dc2626&color=fff&size=48" alt="Admin" />
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

        {/* Navigation */}
        <div className="nav-menu">
          {/* Dashboard */}
          <Link to="/admin/dashboard" className={`nav-item ${currentPath === "/admin/dashboard" ? "active" : ""}`}>
            <FiHome className="nav-icon" />
            <span>Dashboard</span>
          </Link>

          {/* Donor Management */}
          <div className="nav-section">
            <div className="nav-header" onClick={() => toggleMenu('donors')}>
              <div className="nav-header-left">
                <FiUsers className="nav-icon" />
                <span>Donor Management</span>
              </div>
              <div className="nav-header-right">
                <span className="count">245</span>
                {expandedMenus.donors ? <FiChevronDown /> : <FiChevronRight />}
              </div>
            </div>
            <div className={`submenu ${expandedMenus.donors ? "open" : ""}`}>
              {donorMenus.map((item, index) => (
                <Link key={index} to={item.path} className="submenu-item">
                  <span className="submenu-icon">{item.icon}</span>
                  <span className="submenu-text">{item.name}</span>
                  {item.count && <span className="submenu-count">{item.count}</span>}
                </Link>
              ))}
            </div>
          </div>

          {/* Blood Requests */}
          <div className="nav-section">
            <div className="nav-header" onClick={() => toggleMenu('requests')}>
              <div className="nav-header-left">
                <FiDroplet className="nav-icon" />
                <span>Blood Requests</span>
              </div>
              <div className="nav-header-right">
                <span className="count urgent">89</span>
                {expandedMenus.requests ? <FiChevronDown /> : <FiChevronRight />}
              </div>
            </div>
            <div className={`submenu ${expandedMenus.requests ? "open" : ""}`}>
              {requestMenus.map((item, index) => (
                <Link key={index} to={item.path} className="submenu-item">
                  <span className="submenu-icon">{item.icon}</span>
                  <span className="submenu-text">{item.name}</span>
                  {item.count && <span className="submenu-count">{item.count}</span>}
                </Link>
              ))}
            </div>
          </div>

          {/* Gallery Management */}
          <div className="nav-section">
            <div className="nav-header" onClick={() => toggleMenu('gallery')}>
              <div className="nav-header-left">
                <FiImage className="nav-icon" />
                <span>Gallery Management</span>
              </div>
              <div className="nav-header-right">
                <span className="count">156</span>
                {expandedMenus.gallery ? <FiChevronDown /> : <FiChevronRight />}
              </div>
            </div>
            <div className={`submenu ${expandedMenus.gallery ? "open" : ""}`}>
              {galleryMenus.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.path} 
                  className={`submenu-item ${item.highlight ? 'highlight' : ''}`}
                >
                  <span className="submenu-icon">{item.icon}</span>
                  <span className="submenu-text">{item.name}</span>
                  {item.count && <span className="submenu-count">{item.count}</span>}
                </Link>
              ))}
            </div>
          </div>

          {/* Donation Camps */}
          <Link to="/admin/camps" className={`nav-item ${currentPath.includes("/admin/camps") ? "active" : ""}`}>
            <FiCalendar className="nav-icon" />
            <span>Donation Camps</span>
          </Link>

          {/* Certificates */}
          <Link to="/admin/certificates" className={`nav-item ${currentPath.includes("/admin/certificates") ? "active" : ""}`}>
            <FiAward className="nav-icon" />
            <span>Certificates</span>
          </Link>

          {/* Reports */}
          <Link to="/admin/reports" className={`nav-item ${currentPath.includes("/admin/reports") ? "active" : ""}`}>
            <FiPieChart className="nav-icon" />
            <span>Reports</span>
          </Link>

          {/* Messages */}
          <Link to="/admin/messages" className={`nav-item ${currentPath === "/admin/messages" ? "active" : ""}`}>
            <FiMessageCircle className="nav-icon" />
            <span>Messages</span>
            <span className="badge count">12</span>
          </Link>

          {/* Settings */}
          <Link to="/admin/settings" className={`nav-item ${currentPath === "/admin/settings" ? "active" : ""}`}>
            <FiSettings className="nav-icon" />
            <span>Settings</span>
          </Link>

          {/* Help */}
          <Link to="/admin/help" className={`nav-item ${currentPath === "/admin/help" ? "active" : ""}`}>
            <FiHelpCircle className="nav-icon" />
            <span>Help</span>
          </Link>
        </div>

        {/* Logout */}
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>

        {/* Version */}
        <div className="version">v2.0.0</div>
      </div>
    </>
  );
}