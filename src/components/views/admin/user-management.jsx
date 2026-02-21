import { useState, useCallback, useMemo } from "react";
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
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiShield,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiFileText,
  FiRefreshCw,
} from "react-icons/fi";
import { FaTint } from "react-icons/fa";
import "./user-management.scss";

import { fetchAllUsers ,blockUser,unblockUser} from "../../../services/adminServices";
import { useEffect } from "react";
import AddDonorModal from "../../sections/add-doner-modal/add-doner-modal";

// Loading Skeleton Component
const UserCardSkeleton = () => (
  <div className="user-card skeleton">
    <div className="card-header">
      <div className="user-avatar skeleton-box" />
      <div className="user-basic-info">
        <div className="skeleton-text" style={{ width: "120px" }} />
        <div className="skeleton-text" style={{ width: "160px" }} />
      </div>
      <div className="skeleton-icon" />
    </div>
    <div className="user-details">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="detail-row">
          <div className="skeleton-icon-small" />
          <div className="skeleton-text" style={{ width: "150px" }} />
        </div>
      ))}
    </div>
    <div className="user-stats">
      <div className="skeleton-badge" />
      <div className="skeleton-text" style={{ width: "100px" }} />
    </div>
    <div className="verification-status">
      <div className="skeleton-badge" />
    </div>
    <div className="user-actions">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-button" />
      ))}
    </div>
  </div>
);

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-notification ${type}`}>
      {type === 'success' && <FiCheckCircle />}
      {type === 'error' && <FiXCircle />}
      {type === 'info' && <FiClock />}
      <span>{message}</span>
    </div>
  );
};

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [toast, setToast] = useState(null);
  const [showAddDonorModal, setShowAddDonorModal] = useState(false);
  // Filter states
  const [filters, setFilters] = useState({
    bloodGroup: "",
    location: "",
    verificationStatus: "",
    dateRange: "",
  });

  // Memoized stats for better performance
  const stats = useMemo(() => ({
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    pendingVerification: users.filter((u) => u.verificationStatus === "pending").length,
    blockedUsers: users.filter((u) => u.status === "blocked").length,
    totalDonations: users.reduce((acc, u) => acc + u.totalDonations, 0),
  }), [users]);


const handleDonorAdded = () => {
  showToast('Donor added successfully', 'success');
  // Refresh the user list
  loadUsers(searchQuery, activeTab, currentPage);
};





  // Show toast message
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Handle block/unblock with optimistic updates
  const handleBlockUser = async (userId) => {
  // Save previous state for rollback
  const previousUsers = [...users];

  // 🔥 Optimistic UI Update
  setUsers((prevUsers) =>
    prevUsers.map((user) =>
      user.id === userId
        ? {
            ...user,
            status: "blocked",
            isBlocked: true,
            blockReason: "Admin action",
          }
        : user
    )
  );

  try {
    await blockUser(userId, "Admin action");

    showToast("User blocked successfully", "success");

  } catch (error) {
    console.error("Block error:", error);

    // 🔄 Rollback if failed
    setUsers(previousUsers);

    showToast("Failed to block user", "error");
  }
};

  const handleUnblockUser = async (userId) => {
  const previousUsers = [...users];

  // Optimistic update
  setUsers((prevUsers) =>
    prevUsers.map((user) =>
      user.id === userId
        ? {
            ...user,
            status: "active",
            isBlocked: false,
            blockReason: null,
          }
        : user
    )
  );

  try {
    await unblockUser(userId);

    showToast("User unblocked successfully", "success");

  } catch (error) {
    console.error("Unblock error:", error);

    setUsers(previousUsers);

    showToast("Failed to unblock user", "error");
  }
};
  const handleRejectDonation = (userId) => {
    setUsers(prevUsers =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              verificationStatus: "rejected",
            }
          : user,
      ),
    );
    setShowVerifyModal(false);
    showToast('Donation proof rejected', 'info');
  };

  // Handle certificate generation
  const handleGenerateCertificate = (userId) => {
    const user = users.find((u) => u.id === userId);
    showToast(`Certificate generated for ${user.name}`, 'success');
    setShowCertificateModal(false);
  };

  // Load users with loading states
  const loadUsers = useCallback(async (search = "", tab = "all", page = 1, showRefresh = false) => {
    try {
      if (showRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const data = await fetchAllUsers({
        search,
        tab,
        page,
        limit: itemsPerPage,
        ...filters, // Include filters in API call
      });
      
      const usersData = data.users || data;
      const total = data.totalPages || Math.ceil((data.totalUsers || usersData.length) / itemsPerPage);
      
      setTotalPages(total);
      
      const formattedUsers = usersData.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.mobile,
        bloodGroup: user.bloodGroup,
        location: `${user.district || ''}, ${user.taluk || ''}`,
        registeredDate: user.createdAt?.split("T")[0],
        lastDonation: user.latestDonatedDate
          ? user.latestDonatedDate.split("T")[0]
          : null,
        totalDonations: user.donationCount || 0,
        status: user.isBlocked
          ? "blocked"
          : user.isVerified
          ? "active"
          : "pending",
        verified: user.isVerified,
        verificationStatus: user.isVerified ? "verified" : "pending",
        isBlocked: user.isBlocked || false,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ef4444&color=fff`,
        donationProof: user.donationProof || {
          date: user.latestDonatedDate?.split("T")[0] || new Date().toISOString().split("T")[0],
          center: user.donationCenter || "City Blood Bank",
          document: user.documentName || "donation_certificate.pdf"
        }
      }));
      
      setUsers(formattedUsers);
      
      if (showRefresh) {
        showToast('Data refreshed successfully', 'success');
      }
    } catch (error) {
      console.error("User fetch error:", error);
      showToast('Failed to load users', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [itemsPerPage, filters]);

  // Debounced search with cleanup
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadUsers(searchQuery, activeTab, currentPage);
    }, 300); // Reduced to 300ms for better responsiveness

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, activeTab, currentPage, loadUsers]);

  // Refresh handler
  const handleRefresh = () => {
    loadUsers(searchQuery, activeTab, currentPage, true);
  };

  // Filter Modal Component
  const FilterModal = ({ onClose }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleApply = () => {
      setFilters(localFilters);
      setCurrentPage(1);
      onClose();
    };

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content filter-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>
              <FiFilter className="modal-icon" />
              Filter Users
            </h3>
            <button className="close-btn" onClick={onClose}>
              <FiXCircle />
            </button>
          </div>

          <div className="modal-body">
            <div className="filter-group">
              <label>Blood Group</label>
              <select
                value={localFilters.bloodGroup}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, bloodGroup: e.target.value })
                }
              >
                <option value="">All Blood Groups</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Location</label>
              <input
                type="text"
                placeholder="Enter district or taluk"
                value={localFilters.location}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, location: e.target.value })
                }
              />
            </div>

            <div className="filter-group">
              <label>Verification Status</label>
              <select
                value={localFilters.verificationStatus}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, verificationStatus: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Date Range</label>
              <select
                value={localFilters.dateRange}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, dateRange: e.target.value })
                }
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="clear-btn"
              onClick={() =>
                setLocalFilters({
                  bloodGroup: "",
                  location: "",
                  verificationStatus: "",
                  dateRange: "",
                })
              }
            >
              Clear All
            </button>
            <button className="apply-btn" onClick={handleApply}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Verification Modal
  const VerificationModal = ({ user, onClose }) => {
    const [isVerifying, setIsVerifying] = useState(false);

    if (!user) return null;

    const handleVerify = async () => {
      setIsVerifying(true);
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500));
      handleVerifyDonation(user.id);
      setIsVerifying(false);
    };

    const handleReject = async () => {
      setIsVerifying(true);
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500));
      handleRejectDonation(user.id);
      setIsVerifying(false);
    };

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content verification-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>
              <FiShield className="modal-icon" />
              Verify Donation Proof
            </h3>
            <button className="close-btn" onClick={onClose} disabled={isVerifying}>
              <FiXCircle />
            </button>
          </div>

          <div className="modal-body">
            <div className="user-info-summary">
              <img src={user.avatar} alt={user.name} className="user-avatar" />
              <div>
                <h4>{user.name}</h4>
                <p className="user-email">{user.email}</p>
                <span className="blood-badge">{user.bloodGroup}</span>
              </div>
            </div>

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

            <div className="proof-image-preview">
              <img
                src="https://via.placeholder.com/400x300"
                alt="Proof Document"
                className="proof-image"
              />
              <div className="image-actions">
                <button className="image-action-btn" disabled={isVerifying}>
                  <FiEye /> View Full
                </button>
                <button className="image-action-btn" disabled={isVerifying}>
                  <FiDownload /> Download
                </button>
              </div>
            </div>

            <div className="verification-actions">
              <button
                className="verify-btn"
                onClick={handleVerify}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <FiRefreshCw className="spinning" />
                ) : (
                  <FiCheckCircle />
                )}
                {isVerifying ? 'Verifying...' : 'Verify & Mark as Donated'}
              </button>
              <button
                className="reject-btn"
                onClick={handleReject}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <FiRefreshCw className="spinning" />
                ) : (
                  <FiXCircle />
                )}
                {isVerifying ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Certificate Modal
  const CertificateModal = ({ user, onClose }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    if (!user) return null;

    const handleGenerate = async () => {
      setIsGenerating(true);
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      handleGenerateCertificate(user.id);
      setIsGenerating(false);
    };

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content certificate-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>
              <FiAward className="modal-icon" />
              Generate Certificate
            </h3>
            <button className="close-btn" onClick={onClose} disabled={isGenerating}>
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
                  <p className="certificate-date">
                    {new Date().toLocaleDateString()}
                  </p>
                  <div className="certificate-blood">{user.bloodGroup}</div>
                </div>
              </div>
            </div>

            <div className="certificate-options">
              <label className="option-label">
                <input type="checkbox" defaultChecked disabled={isGenerating} /> 
                Include Donation Details
              </label>
              <label className="option-label">
                <input type="checkbox" defaultChecked disabled={isGenerating} /> 
                Add QR Code
              </label>
              <label className="option-label">
                <input type="checkbox" disabled={isGenerating} /> 
                Send via Email
              </label>
            </div>

            <div className="certificate-actions">
              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <FiRefreshCw className="spinning" />
                ) : (
                  <FiAward />
                )}
                {isGenerating ? 'Generating...' : 'Generate Certificate'}
              </button>
              <button className="preview-btn" disabled={isGenerating}>
                <FiEye />
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Show loading skeletons
  if (isLoading) {
    return (
      <div className="user-management">
        <div className="header-section">
          <div>
            <h1 className="page-title">
              <FiUsers className="title-icon" />
              User Management
            </h1>
            <p className="page-subtitle">
              Manage donors, verify donations, and issue certificates
            </p>
          </div>
        </div>
        <div className="stats-grid">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="stat-card skeleton">
              <div className="skeleton-icon" />
              <div className="stat-info">
                <div className="skeleton-text" />
                <div className="skeleton-text" />
              </div>
            </div>
          ))}
        </div>
        <div className="users-grid">
          {[1, 2, 3, 4].map((i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header with Refresh Button */}
     <div className="header-section">
  <div>
    <h1 className="page-title">
      <FiUsers className="title-icon" />
      User Management
    </h1>
    <p className="page-subtitle">
      Manage donors, verify donations, and issue certificates
    </p>
  </div>
  <div className="header-actions">
    <button 
      className="refresh-btn" 
      onClick={handleRefresh}
      disabled={isRefreshing}
    >
      <FiRefreshCw className={isRefreshing ? "spinning" : ""} />
      {isRefreshing ? 'Refreshing...' : 'Refresh'}
    </button>
    <button 
      className="add-user-btn"
      onClick={() => setShowAddDonorModal(true)}
    >
      <FiPlus />
      Add New Donor
    </button>
  </div>
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
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
          >
            All Users
          </button>
          <button
            className={`tab ${activeTab === "active" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("active");
              setCurrentPage(1);
            }}
          >
            Active
          </button>
          <button
            className={`tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("pending");
              setCurrentPage(1);
            }}
          >
            Pending Verification
            {stats.pendingVerification > 0 && (
              <span className="tab-badge">{stats.pendingVerification}</span>
            )}
          </button>
          <button
            className={`tab ${activeTab === "verified" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("verified");
              setCurrentPage(1);
            }}
          >
            Verified
          </button>
          <button
            className={`tab ${activeTab === "blocked" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("blocked");
              setCurrentPage(1);
            }}
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
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery("")}
              >
                <FiXCircle />
              </button>
            )}
          </div>
          <button
            className={`filter-btn ${Object.values(filters).some(v => v) ? 'active' : ''}`}
            onClick={() => setShowFilterModal(true)}
          >
            <FiFilter />
            Filter
            {Object.values(filters).some(v => v) && (
              <span className="filter-badge" />
            )}
          </button>
        </div>
      </div>

      {/* Users Grid with Refresh Overlay */}
      <div className="users-grid-container">
        {isRefreshing && (
          <div className="refresh-overlay">
            <FiRefreshCw className="spinning" />
            <span>Refreshing data...</span>
          </div>
        )}
        
        <div className={`users-grid ${isRefreshing ? 'refreshing' : ''}`}>
          {users.length === 0 ? (
            <div className="no-users">
              <FiUsers size={48} />
              <h3>No users found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            users.map((user) => (
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
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-nav"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isRefreshing}
          >
            <FiChevronLeft />
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
              disabled={isRefreshing}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="page-nav"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isRefreshing}
          >
            <FiChevronRight />
          </button>
        </div>
      )}

      {/* Modals */}
      {showFilterModal && (
        <FilterModal onClose={() => setShowFilterModal(false)} />
      )}

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
      {showAddDonorModal && (
  <AddDonorModal
    onClose={() => setShowAddDonorModal(false)}
    onSuccess={handleDonorAdded}
  />
)}
    </div>
  );
}