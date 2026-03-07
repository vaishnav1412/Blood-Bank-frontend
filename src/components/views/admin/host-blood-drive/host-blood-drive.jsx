import { useState, useEffect } from "react";
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiEye,
  FiDownload,
  FiFilter,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiUserCheck,
  FiAward,
  FiPrinter,
  FiRefreshCw
} from "react-icons/fi";
import { FaTint, FaSchool, FaUniversity, FaBuilding, FaUsers as FaUsersSolid, FaHome } from "react-icons/fa";
import { format } from "date-fns"; // Added date-fns for export formatting
import toast from "react-hot-toast"; // Added for notifications
import "./host-blood-drive.scss";
import { getBloodDriveApplications ,updateBloodDriveApplication} from "../../../../services/adminServices";
// --- MOCK DATA (Simulating Database) ---

const MOCK_COORDINATORS = [
  { id: 1, name: "Rajesh Kumar", available: true, assignedCamps: 3 },
  { id: 2, name: "Anita Desai", available: true, assignedCamps: 2 },
  { id: 3, name: "Suresh Patel", available: false, assignedCamps: 5 },
  { id: 4, name: "Priya Sharma", available: true, assignedCamps: 1 },
  { id: 5, name: "Amit Verma", available: true, assignedCamps: 4 }
];

// --- HELPER FUNCTIONS ---

const getOrgIcon = (type) => {
  switch (type) {
    case "school": return <FaSchool />;
    case "college": return <FaUniversity />;
    case "corporate": return <FaBuilding />;
    case "ngo": return <FaUsersSolid />;
    case "government": return <FaHome />;
    default: return <FaBuilding />;
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return <span className="status-badge pending"><FiClock /> Pending</span>;
    case "approved":
      return <span className="status-badge approved"><FiCheckCircle /> Approved</span>;
    case "scheduled":
      return <span className="status-badge scheduled"><FiCalendar /> Scheduled</span>;
    case "completed":
      return <span className="status-badge completed"><FiAward /> Completed</span>;
    case "rejected":
      return <span className="status-badge rejected"><FiXCircle /> Rejected</span>;
    default:
      return null;
  }
};

// --- MODAL COMPONENTS (Defined outside to prevent re-render issues) ---

const RejectModal = ({ show, onClose, application, onReject }) => {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (show) {
      setReason("");
      setOtherReason("");
    }
  }, [show]);

  if (!show) return null;

  const rejectionReasons = [
    "Date conflict with existing camp",
    "Insufficient information provided",
    "Location not serviceable",
    "Expected donors too low (min 20 required)",
    "Duplicate application",
    "Other"
  ];

  const handleSubmit = () => {
    const finalReason = reason === "Other" ? otherReason : reason;
    if (!finalReason) {
      toast.error("Please provide a reason");
      return;
    }
    onReject(application.id, finalReason);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content reject-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Reject Application</h3>
          <button className="close-btn" onClick={onClose}>
            <FiXCircle />
          </button>
        </div>

        <div className="modal-body">
          <div className="reject-icon">
            <FiXCircle />
          </div>
          <p className="reject-text">
            Please provide a reason for rejecting <strong>{application?.organizationName}</strong>'s application.
          </p>

          <div className="form-group">
            <label>Rejection Reason *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">Select a reason</option>
              {rejectionReasons.map((r, idx) => (
                <option key={idx} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {reason === "Other" && (
            <div className="form-group">
              <label>Please specify *</label>
              <textarea
                rows="2"
                placeholder="Enter rejection reason..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                required
                autoFocus
              />
            </div>
          )}

          <div className="info-box warning">
            <FiAlertCircle />
            <span>This action cannot be undone. The organization will be notified of the rejection.</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="btn-confirm-reject"
            onClick={handleSubmit}
            disabled={!reason || (reason === "Other" && !otherReason)}
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
};

const ApproveModal = ({ show, onClose, application, onApprove }) => {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (show) setNotes("");
  }, [show]);

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content approve-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Approve Application</h3>
          <button className="close-btn" onClick={onClose}>
            <FiXCircle />
          </button>
        </div>

        <div className="modal-body">
          <div className="approve-icon">
            <FiCheckCircle />
          </div>
          <p className="approve-text">
            Are you sure you want to approve this application from <strong>{application?.organizationName}</strong>?
          </p>

          <div className="form-group">
            <label>Add Notes (Optional)</label>
            <textarea
              rows="3"
              placeholder="Add any notes or instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="info-box">
            <FiAlertCircle />
            <span>Approving will move this application to "Approved" status. You can assign a coordinator later.</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="btn-confirm-approve"
            onClick={() => onApprove(application.id, notes)}
          >
            Confirm Approval
          </button>
        </div>
      </div>
    </div>
  );
};

const AssignModal = ({ show, onClose, application, coordinators, onAssign }) => {
  const [selectedCoordinator, setSelectedCoordinator] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  useEffect(() => {
    if (show && application) {
      setSelectedCoordinator("");
      setScheduleDate(application.eventDate || "");
      setScheduleTime(application.eventTime || "");
    }
  }, [show, application]);

  if (!show || !application) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content assign-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Assign Coordinator</h3>
          <button className="close-btn" onClick={onClose}>
            <FiXCircle />
          </button>
        </div>

        <div className="modal-body">
          <div className="assign-icon">
            <FiUserCheck />
          </div>
          <p className="assign-text">
            Assign a coordinator for <strong>{application.organizationName}</strong> blood drive.
          </p>

          <div className="form-group">
            <label>Select Coordinator *</label>
            <select
              value={selectedCoordinator}
              onChange={(e) => setSelectedCoordinator(e.target.value)}
              required
            >
              <option value="">Choose coordinator</option>
              {coordinators.filter(c => c.available).map(coord => (
                <option key={coord.id} value={coord.name}>
                  {coord.name} ({coord.assignedCamps} active camps)
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Schedule Date</label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>Schedule Time</label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Additional Instructions</label>
            <textarea
              rows="2"
              placeholder="Enter any special instructions for the coordinator..."
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="btn-assign"
            onClick={() => onAssign(application.id, selectedCoordinator)}
            disabled={!selectedCoordinator}
          >
            Assign Coordinator
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailsModal = ({ show, onClose, application, onApprove, onReject, onAssign }) => {
  if (!show || !application) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            Application Details
            <span className="app-id">{application.applicationId}</span>
          </h3>
          <button className="close-btn" onClick={onClose}>
            <FiXCircle />
          </button>
        </div>

        <div className="modal-body">
          {/* Organization Info */}
          <div className="detail-section">
            <h4>Organization Information</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Organization:</span>
                <span className="value">{application.organizationName}</span>
              </div>
              <div className="detail-item">
                <span className="label">Type:</span>
                <span className="value org-type">
                  {getOrgIcon(application.organizationType)}
                  {application.organizationType}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Contact Person:</span>
                <span className="value">{application.contactPerson}</span>
              </div>
              <div className="detail-item">
                <span className="label">Email:</span>
                <span className="value">{application.email}</span>
              </div>
              <div className="detail-item">
                <span className="label">Phone:</span>
                <span className="value">{application.phone}</span>
              </div>
              {application.alternatePhone && (
                <div className="detail-item">
                  <span className="label">Alt Phone:</span>
                  <span className="value">{application.alternatePhone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Event Details */}
          <div className="detail-section">
            <h4>Event Details</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Date:</span>
                <span className="value">{new Date(application.eventDate).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <span className="label">Time:</span>
                <span className="value">{application.eventTime}</span>
              </div>
              <div className="detail-item">
                <span className="label">Duration:</span>
                <span className="value">{application.duration} hours</span>
              </div>
              <div className="detail-item">
                <span className="label">Expected Donors:</span>
                <span className="value">{application.expectedDonors}</span>
              </div>
              <div className="detail-item">
                <span className="label">Venue:</span>
                <span className="value">{application.venue}</span>
              </div>
              <div className="detail-item">
                <span className="label">Address:</span>
                <span className="value">{application.address}, {application.city} - {application.pincode}</span>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="detail-section">
            <h4>Requirements</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Staff Required:</span>
                <span className="value">{application.requiredStaff} coordinators</span>
              </div>
              <div className="detail-item">
                <span className="label">Equipment:</span>
                <div className="equipment-list">
                  {application.equipment.map((eq, idx) => (
                    <span key={idx} className="equipment-tag">{eq.replace(/-/g, ' ')}</span>
                  ))}
                </div>
              </div>
              <div className="detail-item full-width">
                <span className="label">Special Requirements:</span>
                <span className="value">{application.specialRequirements || "None"}</span>
              </div>
            </div>
          </div>

          {/* Status & Notes */}
          <div className="detail-section">
            <h4>Status & Notes</h4>
            <div className="status-section">
              {getStatusBadge(application.status)}
              {application.assignedCoordinator && (
                <div className="assigned-info">
                  <FiUserCheck /> Assigned to: {application.assignedCoordinator}
                </div>
              )}
            </div>
            {application.notes && (
              <div className="notes-box">
                <strong>Notes:</strong>
                <p>{application.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-print" onClick={() => window.print()}>
            <FiPrinter /> Print
          </button>
          <button className="btn-download">
            <FiDownload /> Download
          </button>
          {application.status === "pending" && (
            <>
              <button
                className="btn-approve"
                onClick={() => {
                  onClose();
                  onApprove(application);
                }}
              >
                <FiCheckCircle /> Approve
              </button>
              <button
                className="btn-reject"
                onClick={() => {
                  onClose();
                  onReject(application);
                }}
              >
                <FiXCircle /> Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function AdminHostBloodDrive() {
  const [applications, setApplications] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // 1. Fetch Data on Mount
  useEffect(() => {
    fetchApplications();
    fetchCoordinators();
  }, []);

 const fetchApplications = async () => {
  setLoading(true);

  try {
    const data = await getBloodDriveApplications();

    setApplications(data.applications);

  } catch (error) {
    console.error("Error fetching applications:", error);
    toast.error("Failed to fetch applications");

  } finally {
    setLoading(false);
  }
};

  const fetchCoordinators = async () => {
    try {
      // Simulate API Call
      // const response = await api.get('/coordinators');
      // setCoordinators(response.data);
      
      setCoordinators(MOCK_COORDINATORS);
    } catch (error) {
      console.error("Error fetching coordinators:", error);
    }
  };

  // Statistics Calculation
  const stats = {
    totalApplications: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    approved: applications.filter(a => a.status === "approved").length,
    scheduled: applications.filter(a => a.status === "scheduled").length,
    completed: applications.filter(a => a.status === "completed").length,
    rejected: applications.filter(a => a.status === "rejected").length,
    totalDonors: applications.reduce((acc, a) => acc + a.expectedDonors, 0)
  };

  // Filter Logic
  const filteredApplications = applications.filter(app => {
    if (activeTab !== "all" && app.status !== activeTab) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        app.organizationName.toLowerCase().includes(query) ||
        app.contactPerson.toLowerCase().includes(query) ||
        app.email.toLowerCase().includes(query) ||
        app.city.toLowerCase().includes(query) ||
        app.applicationId.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Pagination Logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
 const handleApprove = async (notes) => {
  if (!selectedApplication) {
    toast.error("No application selected");
    return;
  }

  const applicationId = selectedApplication._id;

  try {
    await updateBloodDriveApplication(applicationId, {
      status: "approved",
      notes: notes || "Approved by admin"
    });

    const updated = applications.map(app =>
      app._id === applicationId
        ? {
            ...app,
            status: "approved",
            reviewedAt: new Date().toISOString(),
            notes: notes || "Approved by admin"
          }
        : app
    );

    setApplications(updated);

    setShowApproveModal(false);
    setSelectedApplication(null);

    toast.success("Application approved successfully!");

  } catch (error) {
    console.error("Approve error:", error);
    toast.error("Failed to approve application");
  }
};



 const handleReject = async (reason) => {
  if (!selectedApplication) return;

  const applicationId = selectedApplication._id;

  try {
    await updateBloodDriveApplication(applicationId, {
      status: "rejected",
      notes: reason
    });

    const updated = applications.map(app =>
      app._id === applicationId
        ? {
            ...app,
            status: "rejected",
            reviewedAt: new Date().toISOString(),
            notes: reason
          }
        : app
    );

    setApplications(updated);
    setShowRejectModal(false);
    setSelectedApplication(null);

    toast.success("Application rejected");

  } catch (error) {
    console.error("Reject error:", error);
    toast.error("Failed to reject application");
  }
};

  const handleAssignCoordinator = (applicationId, coordinatorName) => {
    setApplications(applications.map(app =>
      app.id === applicationId
        ? { ...app, assignedCoordinator: coordinatorName, status: "scheduled" }
        : app
    ));
    setShowAssignModal(false);
    setSelectedApplication(null);
    toast.success(`Coordinator ${coordinatorName} assigned.`);
  };

  const handleExport = () => {
    if (filteredApplications.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      "Application ID", "Organization", "Type", "Contact Person", "Email", "Phone",
      "Event Date", "Time", "Duration", "Expected Donors", "Venue", "City", "Status", "Assigned Coordinator"
    ];

    const csvRows = filteredApplications.map(app => [
      app.applicationId,
      app.organizationName,
      app.organizationType,
      app.contactPerson,
      app.email,
      app.phone,
      format(new Date(app.eventDate), "yyyy-MM-dd"),
      app.eventTime,
      app.duration,
      app.expectedDonors,
      app.venue,
      app.city,
      app.status,
      app.assignedCoordinator || "N/A"
    ]);

    const csvContent = [
      headers.join(","),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `blood_drive_applications_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const openModal = (type, app) => {
    setSelectedApplication(app);
    if (type === 'details') setShowDetailsModal(true);
    if (type === 'approve') setShowApproveModal(true);
    if (type === 'reject') setShowRejectModal(true);
    if (type === 'assign') setShowAssignModal(true);
  };

  const closeAllModals = () => {
    setShowDetailsModal(false);
    setShowApproveModal(false);
    setShowRejectModal(false);
    setShowAssignModal(false);
    setSelectedApplication(null);
  };

  return (
    <div className="admin-host-blood-drive">
      {/* Header */}
      <div className="header-section">
        <div>
          <h1 className="page-title">
            <FiCalendar className="title-icon" />
            Host Blood Drive Management
          </h1>
          <p className="page-subtitle">Manage camp applications, approvals, and scheduling</p>
        </div>
        <div className="header-actions">
            <button className="refresh-btn" onClick={fetchApplications}>
                <FiRefreshCw /> Refresh
            </button>
            <button className="export-btn" onClick={handleExport}>
                <FiDownload /> Export Report
            </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon"><FiCalendar /></div>
          <div className="stat-info">
            <span className="stat-label">Total Applications</span>
            <span className="stat-value">{stats.totalApplications}</span>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon"><FiClock /></div>
          <div className="stat-info">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
        </div>
        <div className="stat-card approved">
          <div className="stat-icon"><FiCheckCircle /></div>
          <div className="stat-info">
            <span className="stat-label">Approved</span>
            <span className="stat-value">{stats.approved}</span>
          </div>
        </div>
        <div className="stat-card scheduled">
          <div className="stat-icon"><FiCalendar /></div>
          <div className="stat-info">
            <span className="stat-label">Scheduled</span>
            <span className="stat-value">{stats.scheduled}</span>
          </div>
        </div>
        <div className="stat-card completed">
          <div className="stat-icon"><FiAward /></div>
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{stats.completed}</span>
          </div>
        </div>
        <div className="stat-card donors">
          <div className="stat-icon"><FaTint /></div>
          <div className="stat-info">
            <span className="stat-label">Expected Donors</span>
            <span className="stat-value">{stats.totalDonors}</span>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="tabs-section">
        <div className="tabs">
          {["all", "pending", "approved", "scheduled", "completed", "rejected"].map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "pending" && stats.pending > 0 && <span className="tab-badge">{stats.pending}</span>}
            </button>
          ))}
        </div>

        <div className="search-filter">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by organization, contact, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="filter-btn">
            <FiFilter /> Filter
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="applications-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading applications...</p>
          </div>
        ) : (
          <table className="applications-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Organization</th>
                <th>Contact</th>
                <th>Event Details</th>
                <th>Donors</th>
                <th>Status</th>
                
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedApplications.map(app => (
                <tr key={app._id} className={app.status}>
                  <td>
                    <div className="app-id">{app.applicationId}</div>
                    <div className="app-date">{new Date(app.submittedAt).toLocaleDateString()}</div>
                  </td>
                  <td>
                    <div className="org-info">
                      <span className="org-icon">{getOrgIcon(app.organizationType)}</span>
                      <div>
                        <div className="org-name">{app.organizationName}</div>
                        <div className="org-type">{app.organizationType}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div className="contact-name">{app.contactPerson}</div>
                      <div className="contact-email">{app.email}</div>
                      <div className="contact-phone">{app.phone}</div>
                    </div>
                  </td>
                  <td>
                    <div className="event-info">
                      <div className="event-date">
                        <FiCalendar /> {new Date(app.eventDate).toLocaleDateString()}
                      </div>
                      <div className="event-time">
                        <FiClock /> {app.eventTime}
                      </div>
                      <div className="event-location">
                        <FiMapPin /> {app.city}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="donors-info">
                      <FaTint className="donor-icon" />
                      <span className="donor-count">{app.expectedDonors}</span>
                    </div>
                  </td>
                  <td>{getStatusBadge(app.status)}</td>
                 
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view"
                        onClick={() => openModal('details', app)}
                        title="View Details"
                      >
                        <FiEye />
                      </button>

                      {app.status === "approved" && (
                        <button
                          className="action-btn assign"
                          onClick={() => openModal('assign', app)}
                          title="Assign Coordinator"
                        >
                          <FiUserCheck />
                        </button>
                      )}

                      {app.status === "pending" && (
                        <>
                          <button
                            className="action-btn approve"
                            onClick={() => openModal('approve', app)}
                            title="Approve"
                          >
                            <FiCheckCircle />
                          </button>
                          <button
                            className="action-btn reject"
                            onClick={() => openModal('reject', app)}
                            title="Reject"
                          >
                            <FiXCircle />
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

        {!loading && paginatedApplications.length === 0 && (
          <div className="no-results">
            <FiCalendar className="no-results-icon" />
            <h3>No applications found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        )}
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
      <DetailsModal
        show={showDetailsModal}
        onClose={closeAllModals}
        application={selectedApplication}
        onApprove={(app) => { setSelectedApplication(app); setShowDetailsModal(false); setShowApproveModal(true); }}
        onReject={(app) => { setSelectedApplication(app); setShowDetailsModal(false); setShowRejectModal(true); }}
      />

      <ApproveModal
        show={showApproveModal}
        onClose={closeAllModals}
        application={selectedApplication}
        onApprove={handleApprove}
      />

      <RejectModal
        show={showRejectModal}
        onClose={closeAllModals}
        application={selectedApplication}
        onReject={handleReject}
      />

      <AssignModal
        show={showAssignModal}
        onClose={closeAllModals}
        application={selectedApplication}
        coordinators={coordinators}
        onAssign={handleAssignCoordinator}
      />
    </div>
  );
}