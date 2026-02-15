import React, { useState } from "react";
import { 
  FiUsers, 
  FiSearch, 
  FiFilter,
  FiMoreVertical,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUserCheck,
  FiUserX,
  FiEye,
  FiDownload,
  FiAward,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiDroplet,
  FiShield,
  FiAlertCircle,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiUpload,
  FiFileText,
  FiPrinter
} from "react-icons/fi";
import { FaTint, FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import "./user-management.scss";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [verificationProof, setVerificationProof] = useState(null);

  // Mock Users Data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      phone: "+91 98765 43210",
      bloodGroup: "A+",
      location: "Bangalore",
      registeredDate: "2024-01-15",
      lastDonation: "2024-02-10",
      totalDonations: 7,
      status: "active",
      verified: true,
      verificationStatus: "verified",
      donationProof: null,
      isBlocked: false,
      avatar: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=ef4444&color=fff"
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya.patel@email.com",
      phone: "+91 98765 43211",
      bloodGroup: "B+",
      location: "Mumbai",
      registeredDate: "2024-02-20",
      lastDonation: "2024-03-05",
      totalDonations: 3,
      status: "active",
      verified: true,
      verificationStatus: "verified",
      donationProof: null,
      isBlocked: false,
      avatar: "https://ui-avatars.com/api/?name=Priya+Patel&background=ef4444&color=fff"
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit.kumar@email.com",
      phone: "+91 98765 43212",
      bloodGroup: "O+",
      location: "Delhi",
      registeredDate: "2024-03-01",
      lastDonation: "2024-02-28",
      totalDonations: 5,
      status: "active",
      verified: true,
      verificationStatus: "verified",
      donationProof: null,
      isBlocked: false,
      avatar: "https://ui-avatars.com/api/?name=Amit+Kumar&background=ef4444&color=fff"
    },
    {
      id: 4,
      name: "Neha Singh",
      email: "neha.singh@email.com",
      phone: "+91 98765 43213",
      bloodGroup: "AB+",
      location: "Pune",
      registeredDate: "2024-03-10",
      lastDonation: null,
      totalDonations: 0,
      status: "pending",
      verified: false,
      verificationStatus: "pending",
      donationProof: {
        id: "PROOF001",
        date: "2024-03-15",
        center: "City Blood Bank",
        document: "certificate.pdf",
        image: "proof-image.jpg"
      },
      isBlocked: false,
      avatar: "https://ui-avatars.com/api/?name=Neha+Singh&background=ef4444&color=fff"
    },
    {
      id: 5,
      name: "Vikram Mehta",
      email: "vikram.mehta@email.com",
      phone: "+91 98765 43214",
      bloodGroup: "B-",
      location: "Chennai",
      registeredDate: "2024-02-05",
      lastDonation: "2024-01-20",
      totalDonations: 2,
      status: "blocked",
      verified: true,
      verificationStatus: "verified",
      donationProof: null,
      isBlocked: true,
      blockReason: "Multiple no-shows",
      avatar: "https://ui-avatars.com/api/?name=Vikram+Mehta&background=ef4444&color=fff"
    },
    {
      id: 6,
      name: "Anjali Desai",
      email: "anjali.desai@email.com",
      phone: "+91 98765 43215",
      bloodGroup: "A-",
      location: "Ahmedabad",
      registeredDate: "2024-03-18",
      lastDonation: null,
      totalDonations: 0,
      status: "pending",
      verified: false,
      verificationStatus: "pending",
      donationProof: {
        id: "PROOF002",
        date: "2024-03-20",
        center: "General Hospital",
        document: "certificate.pdf",
        image: "proof-image.jpg"
      },
      isBlocked: false,
      avatar: "https://ui-avatars.com/api/?name=Anjali+Desai&background=ef4444&color=fff"
    },
    {
      id: 7,
      name: "Rajesh Nair",
      email: "rajesh.nair@email.com",
      phone: "+91 98765 43216",
      bloodGroup: "O-",
      location: "Kochi",
      registeredDate: "2024-01-28",
      lastDonation: "2024-03-12",
      totalDonations: 4,
      status: "active",
      verified: true,
      verificationStatus: "verified",
      donationProof: null,
      isBlocked: false,
      avatar: "https://ui-avatars.com/api/?name=Rajesh+Nair&background=ef4444&color=fff"
    },
    {
      id: 8,
      name: "Kavita Reddy",
      email: "kavita.reddy@email.com",
      phone: "+91 98765 43217",
      bloodGroup: "AB-",
      location: "Hyderabad",
      registeredDate: "2024-03-05",
      lastDonation: null,
      totalDonations: 0,
      status: "pending",
      verified: false,
      verificationStatus: "pending",
      donationProof: {
        id: "PROOF003",
        date: "2024-03-22",
        center: "Blood Bank Center",
        document: "certificate.pdf",
        image: "proof-image.jpg"
      },
      isBlocked: false,
      avatar: "https://ui-avatars.com/api/?name=Kavita+Reddy&background=ef4444&color=fff"
    }
  ]);

  // Filter states
  const [filters, setFilters] = useState({
    bloodGroup: "",
    location: "",
    verificationStatus: "",
    dateRange: ""
  });

  // Stats
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === "active").length,
    pendingVerification: users.filter(u => u.verificationStatus === "pending").length,
    blockedUsers: users.filter(u => u.status === "blocked").length,
    totalDonations: users.reduce((acc, u) => acc + u.totalDonations, 0)
  };

  // Filter users based on active tab and search
  const filteredUsers = users.filter(user => {
    // Tab filter
    if (activeTab === "active" && user.status !== "active") return false;
    if (activeTab === "pending" && user.verificationStatus !== "pending") return false;
    if (activeTab === "blocked" && user.status !== "blocked") return false;
    if (activeTab === "verified" && !user.verified) return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query) ||
        user.bloodGroup.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle block/unblock
  const handleBlockUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: "blocked", isBlocked: true, blockReason: "Admin action" }
        : user
    ));
  };

  const handleUnblockUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: "active", isBlocked: false, blockReason: null }
        : user
    ));
  };

  // Handle verification
  const handleVerifyDonation = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            verificationStatus: "verified",
            verified: true,
            status: "active",
            totalDonations: user.totalDonations + 1,
            lastDonation: new Date().toISOString().split('T')[0]
          }
        : user
    ));
    setShowVerifyModal(false);
  };

  const handleRejectDonation = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            verificationStatus: "rejected",
            donationProof: null
          }
        : user
    ));
    setShowVerifyModal(false);
  };

  // Handle certificate generation
  const handleGenerateCertificate = (userId) => {
    const user = users.find(u => u.id === userId);
    // In real app, this would generate PDF
    alert(`Certificate generated for ${user.name}`);
    setShowCertificateModal(false);
  };

  // Verification Modal
  const VerificationModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content verification-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>
              <FiShield className="modal-icon" />
              Verify Donation Proof
            </h3>
            <button className="close-btn" onClick={onClose}>
              <FiXCircle />
            </button>
          </div>

          <div className="modal-body">
            {/* User Info */}
            <div className="user-info-summary">
              <img src={user.avatar} alt={user.name} className="user-avatar" />
              <div>
                <h4>{user.name}</h4>
                <p className="user-email">{user.email}</p>
                <span className="blood-badge">{user.bloodGroup}</span>
              </div>
            </div>

            {/* Proof Details */}
            <div className="proof-section">
              <h5>Donation Proof Details</h5>
              <div className="proof-details">
                <div className="proof-item">
                  <FiCalendar className="proof-icon" />
                  <span>Date: {user.donationProof?.date}</span>
                </div>
                <div className="proof-item">
                  <FiMapPin className="proof-icon" />
                  <span>Center: {user.donationProof?.center}</span>
                </div>
                <div className="proof-item">
                  <FiFileText className="proof-icon" />
                  <span>Document: {user.donationProof?.document}</span>
                </div>
              </div>
            </div>

            {/* Proof Image Preview */}
            <div className="proof-image-preview">
              <img 
                src="https://via.placeholder.com/400x300" 
                alt="Proof Document"
                className="proof-image"
              />
              <div className="image-actions">
                <button className="image-action-btn">
                  <FiEye /> View Full
                </button>
                <button className="image-action-btn">
                  <FiDownload /> Download
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="verification-actions">
              <button 
                className="verify-btn"
                onClick={() => handleVerifyDonation(user.id)}
              >
                <FiCheckCircle />
                Verify & Mark as Donated
              </button>
              <button 
                className="reject-btn"
                onClick={() => handleRejectDonation(user.id)}
              >
                <FiXCircle />
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Certificate Modal
  const CertificateModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content certificate-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>
              <FiAward className="modal-icon" />
              Generate Certificate
            </h3>
            <button className="close-btn" onClick={onClose}>
              <FiXCircle />
            </button>
          </div>

          <div className="modal-body">
            <div className="certificate-preview">
              <div className="certificate-template">
                <div className="certificate-header">
                  <h2>Certificate of Appreciation</h2>
                  <p>Presented to</p>
                </div>
                <div className="certificate-name">{user.name}</div>
                <div className="certificate-details">
                  <p>For their noble contribution of blood donation</p>
                  <p className="certificate-date">{new Date().toLocaleDateString()}</p>
                  <div className="certificate-blood">{user.bloodGroup}</div>
                </div>
              </div>
            </div>

            <div className="certificate-options">
              <label className="option-label">
                <input type="checkbox" defaultChecked /> Include Donation Details
              </label>
              <label className="option-label">
                <input type="checkbox" defaultChecked /> Add QR Code
              </label>
              <label className="option-label">
                <input type="checkbox" /> Send via Email
              </label>
            </div>

            <div className="certificate-actions">
              <button 
                className="generate-btn"
                onClick={() => handleGenerateCertificate(user.id)}
              >
                <FiAward />
                Generate Certificate
              </button>
              <button className="preview-btn">
                <FiEye />
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="user-management">
      {/* Header */}
      <div className="header-section">
        <div>
          <h1 className="page-title">
            <FiUsers className="title-icon" />
            User Management
          </h1>
          <p className="page-subtitle">Manage donors, verify donations, and issue certificates</p>
        </div>
        <button className="add-user-btn">
          <FiPlus />
          Add New User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <FiUsers />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{stats.totalUsers}</span>
          </div>
        </div>
        <div className="stat-card active">
          <div className="stat-icon">
            <FiUserCheck />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active</span>
            <span className="stat-value">{stats.activeUsers}</span>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">
            <FiClock />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending Verification</span>
            <span className="stat-value">{stats.pendingVerification}</span>
          </div>
        </div>
        <div className="stat-card blocked">
          <div className="stat-icon">
            <FiUserX />
          </div>
          <div className="stat-info">
            <span className="stat-label">Blocked</span>
            <span className="stat-value">{stats.blockedUsers}</span>
          </div>
        </div>
        <div className="stat-card donations">
          <div className="stat-icon">
            <FaTint />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Donations</span>
            <span className="stat-value">{stats.totalDonations}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Users
          </button>
          <button 
            className={`tab ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Active
          </button>
          <button 
            className={`tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Verification
            {stats.pendingVerification > 0 && (
              <span className="tab-badge">{stats.pendingVerification}</span>
            )}
          </button>
          <button 
            className={`tab ${activeTab === "verified" ? "active" : ""}`}
            onClick={() => setActiveTab("verified")}
          >
            Verified
          </button>
          <button 
            className={`tab ${activeTab === "blocked" ? "active" : ""}`}
            onClick={() => setActiveTab("blocked")}
          >
            Blocked
          </button>
        </div>

        {/* Search & Filter */}
        <div className="search-filter">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email, phone, blood group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            className="filter-btn"
            onClick={() => setShowFilterModal(true)}
          >
            <FiFilter />
            Filter
          </button>
        </div>
      </div>

      {/* Users Table/Grid */}
      <div className="users-grid">
        {paginatedUsers.map(user => (
          <div key={user.id} className={`user-card ${user.status}`}>
            {/* Card Header */}
            <div className="card-header">
              <div className="user-avatar">
                <img src={user.avatar} alt={user.name} />
                <div className={`status-indicator ${user.status}`} />
              </div>
              <div className="user-basic-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
              <button className="more-options">
                <FiMoreVertical />
              </button>
            </div>

            {/* User Details */}
            <div className="user-details">
              <div className="detail-row">
                <FiPhone className="detail-icon" />
                <span>{user.phone}</span>
              </div>
              <div className="detail-row">
                <FiMapPin className="detail-icon" />
                <span>{user.location}</span>
              </div>
              <div className="detail-row">
                <FiCalendar className="detail-icon" />
                <span>Registered: {user.registeredDate}</span>
              </div>
              {user.lastDonation && (
                <div className="detail-row">
                  <FaTint className="detail-icon" />
                  <span>Last Donation: {user.lastDonation}</span>
                </div>
              )}
            </div>

            {/* Blood Group & Donations */}
            <div className="user-stats">
              <div className="blood-group">{user.bloodGroup}</div>
              <div className="donation-count">
                <FaTint className="blood-icon" />
                <span>{user.totalDonations} donations</span>
              </div>
            </div>

            {/* Verification Status */}
            <div className="verification-status">
              {user.verificationStatus === "verified" ? (
                <span className="status-badge verified">
                  <FiCheckCircle /> Verified
                </span>
              ) : user.verificationStatus === "pending" ? (
                <span className="status-badge pending">
                  <FiClock /> Pending Verification
                </span>
              ) : (
                <span className="status-badge rejected">
                  <FiXCircle /> Rejected
                </span>
              )}

              {user.isBlocked && (
                <span className="status-badge blocked">
                  <FiUserX /> Blocked
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="user-actions">
              {user.verificationStatus === "pending" && (
                <button 
                  className="action-btn verify"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowVerifyModal(true);
                  }}
                >
                  <FiShield />
                  Verify Donation
                </button>
              )}

              {user.verified && user.totalDonations > 0 && (
                <button 
                  className="action-btn certificate"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowCertificateModal(true);
                  }}
                >
                  <FiAward />
                  Certificate
                </button>
              )}

              {!user.isBlocked ? (
                <button 
                  className="action-btn block"
                  onClick={() => handleBlockUser(user.id)}
                >
                  <FiUserX />
                  Block
                </button>
              ) : (
                <button 
                  className="action-btn unblock"
                  onClick={() => handleUnblockUser(user.id)}
                >
                  <FiUserCheck />
                  Unblock
                </button>
              )}

              <button className="action-btn view">
                <FiEye />
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="page-nav"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <FiChevronLeft />
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button 
            className="page-nav"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <FiChevronRight />
          </button>
        </div>
      )}

      {/* Modals */}
      {showVerifyModal && (
        <VerificationModal 
          user={selectedUser} 
          onClose={() => setShowVerifyModal(false)} 
        />
      )}

      {showCertificateModal && (
        <CertificateModal 
          user={selectedUser} 
          onClose={() => setShowCertificateModal(false)} 
        />
      )}
    </div>
  );
}