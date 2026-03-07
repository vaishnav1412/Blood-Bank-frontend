import { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiDownload,
  FiClock,
  FiUser,
  FiCalendar,
  FiMapPin,
  FiDroplet,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiMessageSquare,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiMail,
  FiPhone,
  FiInfo,
} from "react-icons/fi";

import { format } from "date-fns";
import toast from "react-hot-toast";
import "./donation-management.scss";
import { getAllDonations ,rejectDonation,verifyDonation} from "../../../../services/adminServices";
const DonationManagement = () => {
  const [donations, setDonations] = useState([]);

  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    bloodGroup: "all",
    dateRange: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    pending: 0,
    verified: 0,
    rejected: 0,
    total: 0,
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const itemsPerPage = 10;

  // Mock data - Replace with API calls
  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
  setLoading(true);

  try {
    const data = await getAllDonations();

    setDonations(data);
    setFilteredDonations(data);
    calculateStats(data);

  } catch (error) {
    console.error("Error fetching donations:", error);
    toast.error("Failed to fetch donations");
  } finally {
    setLoading(false);
  }
};

  const calculateStats = (data) => {
    const stats = {
      pending: data.filter((d) => d.status === "pending").length,
      verified: data.filter((d) => d.status === "verified").length,
      rejected: data.filter((d) => d.status === "rejected").length,
      total: data.length,
    };
    setStats(stats);
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = [...donations];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.donorId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.donorId.mobile.includes(searchTerm) ||
          d.donationCenter.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((d) => d.status === filters.status);
    }

    // Blood group filter
    if (filters.bloodGroup !== "all") {
      filtered = filtered.filter((d) => d.bloodGroup === filters.bloodGroup);
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));

      filtered = filtered.filter((d) => {
        const donationDate = new Date(d.donationDate);
        switch (filters.dateRange) {
          case "today":
            return donationDate >= today;
          case "week":
            return donationDate >= weekAgo;
          case "month":
            return donationDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredDonations(filtered);
    setCurrentPage(1);
  }, [searchTerm, filters, donations]);


  const handleVerify = async () => {
  if (!selectedDonation) {
    toast.error("No donation selected");
    return;
  }

  try {
    await verifyDonation(selectedDonation._id);

    const updatedDonations = donations.map((d) =>
      d._id === selectedDonation._id
        ? { ...d, status: "verified", adminRemarks: "Verified by admin" }
        : d
    );

    setDonations(updatedDonations);
    setFilteredDonations(updatedDonations);
    calculateStats(updatedDonations);

    toast.success("Donation verified successfully!");

    setShowVerifyModal(false);
    setSelectedDonation(null);

  } catch (error) {
    console.error("Error verifying donation:", error);
    toast.error("Failed to verify donation");
  }
};

 const handleReject = async () => {
  if (!rejectReason.trim()) {
    toast.error("Please provide a reason for rejection");
    return;
  }

  try {
    await rejectDonation(selectedDonation._id, rejectReason);

    const updatedDonations = donations.map((d) =>
      d._id === selectedDonation._id
        ? { ...d, status: "rejected", adminRemarks: rejectReason }
        : d
    );

    setDonations(updatedDonations);
    setFilteredDonations(updatedDonations);
    calculateStats(updatedDonations);

    toast.success("Donation rejected successfully!");

    setShowRejectModal(false);
    setRejectReason("");
    setSelectedDonation(null);

  } catch (error) {
    console.error("Error rejecting donation:", error);
    toast.error("Failed to reject donation");
  }
};



  const exportData = () => {
    // Implement export functionality
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDonations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);

  // Image Preview Modal
  const ImagePreviewModal = () => (
    <div
      className="modal-overlay"
      onClick={() => setShowImageModal(false)}
    >
      <div className="image-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={() => setShowImageModal(false)}
        >
          <FiX />
        </button>
        <img src={selectedImage} alt="Donation Proof" />
      </div>
    </div>
  );

  // Details Modal
  const DetailsModal = () => (
    <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
      <div className="details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Donation Details</h2>
          <button
            className="close-btn"
            onClick={() => setShowDetailsModal(false)}
          >
            <FiX />
          </button>
        </div>

        {selectedDonation && (
          <div className="modal-content">
            <div className="donor-info-section">
              <h3>
                <FiUser /> Donor Information
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Name</label>
                  <p>{selectedDonation.donorId.name}</p>
                </div>
                <div className="info-item">
                  <label>Blood Group</label>
                  <p className="blood-group">{selectedDonation.bloodGroup}</p>
                </div>
                <div className="info-item">
                  <label>Mobile</label>
                  <p>{selectedDonation.donorId.mobile}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{selectedDonation.donorId.email}</p>
                </div>
                <div className="info-item">
                  <label>District</label>
                  <p>{selectedDonation.donorId.district}</p>
                </div>
                <div className="info-item">
                  <label>Taluk</label>
                  <p>{selectedDonation.donorId.taluk}</p>
                </div>
              </div>
            </div>

            <div className="donation-info-section">
              <h3>
                <FiDroplet /> Donation Information
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Donation Date</label>
                  <p>{format(new Date(selectedDonation.donationDate), "PPP")}</p>
                </div>
                <div className="info-item">
                  <label>Donation Center</label>
                  <p>{selectedDonation.donationCenter}</p>
                </div>
                <div className="info-item">
                  <label>Units Donated</label>
                  <p>{selectedDonation.units}</p>
                </div>
                <div className="info-item">
                  <label>Submitted On</label>
                  <p>{format(new Date(selectedDonation.createdAt), "PPP")}</p>
                </div>
              </div>
            </div>

            <div className="proof-section">
              <h3>Donation Proof</h3>
              <div
                className="proof-image"
                onClick={() => {
                  setSelectedImage(selectedDonation.proofImage);
                  setShowImageModal(true);
                }}
              >
                <img src={selectedDonation.proofImage} alt="Donation Proof" />
                <div className="image-overlay">
                  <FiEye /> Click to view
                </div>
              </div>
            </div>

            {selectedDonation.adminRemarks && (
              <div className="remarks-section">
                <h3>
                  <FiMessageSquare /> Admin Remarks
                </h3>
                <p>{selectedDonation.adminRemarks}</p>
              </div>
            )}

            <div className="action-buttons">
              {selectedDonation.status === "pending" && (
                <>
                  <button
                    className="verify-btn"
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowVerifyModal(true);
                    }}
                  >
                    <FiCheckCircle /> Verify
                  </button>
                  <button
  className="reject-btn"
  onClick={() => {
   
    setShowDetailsModal(false);
    setShowRejectModal(true);
  }}
>
  <FiXCircle /> Reject
</button>
                </>
              )}
              <button
                className="close-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Verify Modal
  const VerifyModal = () => (
    <div className="modal-overlay" onClick={() => setShowVerifyModal(false)}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <FiCheckCircle className="modal-icon success" />
        <h2>Verify Donation</h2>
        <p>Are you sure you want to verify this donation?</p>
        <p className="warning-text">
          This will update the donor's donation count and certificate status.
        </p>
        <div className="modal-actions">
          <button
            className="cancel-btn"
            onClick={() => setShowVerifyModal(false)}
          >
            Cancel
          </button>
          <button className="confirm-btn success" onClick={handleVerify}>
            Yes, Verify
          </button>
        </div>
      </div>
    </div>
  );

  // Reject Modal
  const RejectModal = () => (
    <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
      <div className="reject-modal" onClick={(e) => e.stopPropagation()}>
        <FiAlertCircle className="modal-icon warning" />
        <h2>Reject Donation</h2>
        <p>Please provide a reason for rejection:</p>
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="e.g., Image unclear, Invalid document, Duplicate entry..."
          rows={4}
        />
        <div className="modal-actions">
          <button
            className="cancel-btn"
            onClick={() => {
              setShowRejectModal(false);
              setRejectReason("");
            }}
          >
            Cancel
          </button>
          <button
            className="confirm-btn warning"
            onClick={handleReject}
            disabled={!rejectReason.trim()}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="donation-management">
      {/* Header */}
      <div className="page-header">
        <h1>Donation Management</h1>
        <div className="header-actions">
          <button className="export-btn" onClick={exportData}>
            <FiDownload /> Export
          </button>
          <button className="refresh-btn" onClick={fetchDonations}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <FiDroplet />
          </div>
          <div className="stat-info">
            <h3>Total Donations</h3>
            <p>{stats.total}</p>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">
            <FiClock />
          </div>
          <div className="stat-info">
            <h3>Pending</h3>
            <p>{stats.pending}</p>
          </div>
        </div>

        <div className="stat-card verified">
          <div className="stat-icon">
            <FiCheckCircle />
          </div>
          <div className="stat-info">
            <h3>Verified</h3>
            <p>{stats.verified}</p>
          </div>
        </div>

        <div className="stat-card rejected">
          <div className="stat-icon">
            <FiXCircle />
          </div>
          <div className="stat-info">
            <h3>Rejected</h3>
            <p>{stats.rejected}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by donor name, mobile, or center..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          className={`filter-toggle ${showFilterPanel ? "active" : ""}`}
          onClick={() => setShowFilterPanel(!showFilterPanel)}
        >
          <FiFilter /> Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Blood Group</label>
            <select
              value={filters.bloodGroup}
              onChange={(e) =>
                setFilters({ ...filters, bloodGroup: e.target.value })
              }
            >
              <option value="all">All Groups</option>
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
            <label>Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) =>
                setFilters({ ...filters, dateRange: e.target.value })
              }
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          <button
            className="clear-filters"
            onClick={() =>
              setFilters({ status: "all", bloodGroup: "all", dateRange: "all" })
            }
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Donations Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading donations...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="empty-state">
            <FiInfo />
            <h3>No donations found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <table className="donations-table">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Contact</th>
                <th>Donation Details</th>
                <th>Blood Group</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((donation) => (
                <tr key={donation._id}>
                  <td>
                    <div className="donor-cell">
                      <div className="donor-avatar">
                        {donation.donorId.name.charAt(0)}
                      </div>
                      <div>
                        <div className="donor-name">{donation.donorId.name}</div>
                        <div className="donor-location">
                          <FiMapPin /> {donation.donorId.district}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="contact-cell">
                      <div className="contact-item">
                        <FiPhone /> {donation.donorId.mobile}
                      </div>
                      <div className="contact-item">
                        <FiMail /> {donation.donorId.email}
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="donation-cell">
                      <div className="donation-date">
                        <FiCalendar />{" "}
                        {format(new Date(donation.donationDate), "dd MMM yyyy")}
                      </div>
                      <div className="donation-center">{donation.donationCenter}</div>
                      <div className="donation-units">{donation.units} Unit(s)</div>
                    </div>
                  </td>

                  <td>
                    <span className="blood-group-badge">
                      {donation.bloodGroup}
                    </span>
                  </td>

                  <td>
                    <span className={`status-badge ${donation.status}`}>
                      {donation.status === "pending" && <FiClock />}
                      {donation.status === "verified" && <FiCheckCircle />}
                      {donation.status === "rejected" && <FiXCircle />}
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </span>
                  </td>

                  <td>
                    <div className="action-cell">
                      <button
                        className="icon-btn view"
                        onClick={() => {
                          setSelectedDonation(donation);
                          setShowDetailsModal(true);
                        }}
                        title="View Details"
                      >
                        <FiEye />
                      </button>
                      {donation.status === "pending" && (
                        <>
                          <button
                            className="icon-btn verify"
                            onClick={() => {
                              setSelectedDonation(donation);
                              setShowVerifyModal(true);
                            }}
                            title="Verify"
                          >
                            <FiCheck />
                          </button>
                          <button
                            className="icon-btn reject"
                            onClick={() => {
                              setSelectedDonation(donation);
                              setShowRejectModal(true);
                            }}
                            title="Reject"
                          >
                            <FiX />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {filteredDonations.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FiChevronLeft /> Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next <FiChevronRight />
          </button>
        </div>
      )}

      {/* Modals */}
      {showDetailsModal && <DetailsModal />}
      {showVerifyModal && <VerifyModal />}
      {showRejectModal && <RejectModal />}
      {showImageModal && <ImagePreviewModal />}
    </div>
  );
};

export default DonationManagement;