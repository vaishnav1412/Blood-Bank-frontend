import  { useState } from "react";
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
  FiMessageSquare,
  FiAward,
  FiMoreVertical,
  FiPrinter
} from "react-icons/fi";
import { FaTint, FaSchool, FaUniversity, FaBuilding, FaUsers as FaUsersSolid } from "react-icons/fa";
import "./host-blood-drive.scss";

export default function AdminHostBloodDrive() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    organizationType: "",
    dateRange: ""
  });

  // Mock Applications Data
  const [applications, setApplications] = useState([
    {
      id: "APP001",
      applicationId: "BD20240315001",
      organizationType: "college",
      organizationName: "ABC Engineering College",
      contactPerson: "Prof. Sharma",
      email: "sharma@abccollege.edu",
      phone: "+91 98765 43210",
      alternatePhone: "+91 98765 43211",
      eventDate: "2024-04-15",
      eventTime: "09:00",
      duration: "6",
      expectedDonors: 120,
      venue: "Main Auditorium",
      address: "College Campus, Sector 62",
      city: "Bangalore",
      pincode: "560102",
      requiredStaff: "4",
      equipment: ["mobile-blood-bank", "beds-chairs", "snacks", "sound-system"],
      specialRequirements: "Need wheelchair access",
      previousExperience: "yes",
      targetGroup: "students",
      awarenessProgram: "yes",
      publicitySupport: "yes",
      status: "pending",
      assignedCoordinator: null,
      submittedAt: "2024-03-10T10:30:00",
      reviewedAt: null,
      notes: ""
    },
    {
      id: "APP002",
      applicationId: "BD20240314002",
      organizationType: "school",
      organizationName: "Delhi Public School",
      contactPerson: "Mr. Verma",
      email: "verma@dps.edu",
      phone: "+91 98765 43212",
      alternatePhone: "",
      eventDate: "2024-04-20",
      eventTime: "10:00",
      duration: "4",
      expectedDonors: 80,
      venue: "School Gymnasium",
      address: "DPS Campus, Civil Lines",
      city: "Delhi",
      pincode: "110054",
      requiredStaff: "3",
      equipment: ["beds-chairs", "snacks", "promotional-material"],
      specialRequirements: "Need to finish before school ends",
      previousExperience: "no",
      targetGroup: "staff",
      awarenessProgram: "yes",
      publicitySupport: "yes",
      status: "approved",
      assignedCoordinator: "Rajesh Kumar",
      submittedAt: "2024-03-09T14:20:00",
      reviewedAt: "2024-03-11T09:15:00",
      notes: "Approved - Coordinator assigned"
    },
    {
      id: "APP003",
      applicationId: "BD20240313003",
      organizationType: "corporate",
      organizationName: "TechCorp India",
      contactPerson: "Ms. Priya Singh",
      email: "priya.singh@techcorp.com",
      phone: "+91 98765 43213",
      alternatePhone: "+91 98765 43214",
      eventDate: "2024-04-25",
      eventTime: "11:00",
      duration: "8",
      expectedDonors: 200,
      venue: "Corporate HQ - Main Hall",
      address: "Tech Park, Whitefield",
      city: "Bangalore",
      pincode: "560066",
      requiredStaff: "6",
      equipment: ["mobile-blood-bank", "beds-chairs", "medical-staff", "snacks", "sound-system", "promotional-material"],
      specialRequirements: "Will have company-wide announcement",
      previousExperience: "yes",
      targetGroup: "public",
      awarenessProgram: "yes",
      publicitySupport: "yes",
      status: "scheduled",
      assignedCoordinator: "Anita Desai",
      submittedAt: "2024-03-08T11:45:00",
      reviewedAt: "2024-03-10T13:30:00",
      notes: "Scheduled - Large camp"
    },
    {
      id: "APP004",
      applicationId: "BD20240312004",
      organizationType: "ngo",
      organizationName: "Red Cross Society",
      contactPerson: "Dr. Khan",
      email: "dr.khan@redcross.org",
      phone: "+91 98765 43215",
      alternatePhone: "",
      eventDate: "2024-04-10",
      eventTime: "08:00",
      duration: "5",
      expectedDonors: 150,
      venue: "Community Center",
      address: "MG Road",
      city: "Mumbai",
      pincode: "400001",
      requiredStaff: "5",
      equipment: ["mobile-blood-bank", "beds-chairs", "medical-staff", "snacks"],
      specialRequirements: "Will coordinate with local hospitals",
      previousExperience: "yes",
      targetGroup: "public",
      awarenessProgram: "yes",
      publicitySupport: "no",
      status: "completed",
      assignedCoordinator: "Suresh Patel",
      submittedAt: "2024-03-05T09:00:00",
      reviewedAt: "2024-03-07T10:20:00",
      notes: "Completed successfully - 142 donors"
    },
    {
      id: "APP005",
      applicationId: "BD20240311005",
      organizationType: "college",
      organizationName: "St. Xavier's College",
      contactPerson: "Fr. Joseph",
      email: "joseph@stxaviers.edu",
      phone: "+91 98765 43216",
      alternatePhone: "+91 98765 43217",
      eventDate: "2024-04-18",
      eventTime: "09:30",
      duration: "6",
      expectedDonors: 100,
      venue: "College Ground",
      address: "St. Xavier's Campus",
      city: "Kolkata",
      pincode: "700016",
      requiredStaff: "4",
      equipment: ["beds-chairs", "snacks", "sound-system"],
      specialRequirements: "Outdoor setup needed",
      previousExperience: "no",
      targetGroup: "students",
      awarenessProgram: "yes",
      publicitySupport: "yes",
      status: "rejected",
      assignedCoordinator: null,
      submittedAt: "2024-03-06T15:20:00",
      reviewedAt: "2024-03-08T11:10:00",
      notes: "Rejected - Date conflict with another camp"
    },
    {
      id: "APP006",
      applicationId: "BD20240309006",
      organizationType: "government",
      organizationName: "District Hospital",
      contactPerson: "Dr. Mehta",
      email: "drdmehta@gov.in",
      phone: "+91 98765 43218",
      alternatePhone: "+91 98765 43219",
      eventDate: "2024-05-01",
      eventTime: "08:00",
      duration: "8",
      expectedDonors: 300,
      venue: "Hospital Premises",
      address: "Civil Hospital Road",
      city: "Lucknow",
      pincode: "226001",
      requiredStaff: "8",
      equipment: ["mobile-blood-bank", "beds-chairs", "medical-staff", "snacks"],
      specialRequirements: "Government event - high visibility",
      previousExperience: "yes",
      targetGroup: "public",
      awarenessProgram: "yes",
      publicitySupport: "yes",
      status: "pending",
      assignedCoordinator: null,
      submittedAt: "2024-03-12T13:45:00",
      reviewedAt: null,
      notes: ""
    }
  ]);

  // Coordinators list
  const coordinators = [
    { id: 1, name: "Rajesh Kumar", available: true, assignedCamps: 3 },
    { id: 2, name: "Anita Desai", available: true, assignedCamps: 2 },
    { id: 3, name: "Suresh Patel", available: false, assignedCamps: 5 },
    { id: 4, name: "Priya Sharma", available: true, assignedCamps: 1 },
    { id: 5, name: "Amit Verma", available: true, assignedCamps: 4 }
  ];

  // Statistics
  const stats = {
    totalApplications: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    approved: applications.filter(a => a.status === "approved").length,
    scheduled: applications.filter(a => a.status === "scheduled").length,
    completed: applications.filter(a => a.status === "completed").length,
    rejected: applications.filter(a => a.status === "rejected").length,
    totalDonors: applications.reduce((acc, a) => acc + a.expectedDonors, 0)
  };

  // Filter applications based on active tab and search
  const filteredApplications = applications.filter(app => {
    // Tab filter
    if (activeTab !== "all" && app.status !== activeTab) return false;
    
    // Search filter
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

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle approve
  const handleApprove = (applicationId) => {
    setApplications(applications.map(app => 
      app.id === applicationId 
        ? { ...app, status: "approved", reviewedAt: new Date().toISOString() }
        : app
    ));
    setShowApproveModal(false);
  };

  // Handle reject
  const handleReject = (applicationId, reason) => {
    setApplications(applications.map(app => 
      app.id === applicationId 
        ? { ...app, status: "rejected", reviewedAt: new Date().toISOString(), notes: reason }
        : app
    ));
    setShowRejectModal(false);
  };

  // Handle assign coordinator
  const handleAssignCoordinator = (applicationId, coordinator) => {
    setApplications(applications.map(app => 
      app.id === applicationId 
        ? { ...app, assignedCoordinator: coordinator, status: "scheduled" }
        : app
    ));
    setShowAssignModal(false);
  };

  // Get organization icon
  const getOrgIcon = (type) => {
    switch(type) {
      case "school": return <FaSchool />;
      case "college": return <FaUniversity />;
      case "corporate": return <FaBuilding />;
      case "ngo": return <FaUsersSolid />;
      default: return <FaHome />;
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
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

  // Details Modal
  const DetailsModal = ({ application, onClose }) => {
    if (!application) return null;

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

            {/* Additional Info */}
            <div className="detail-section">
              <h4>Additional Information</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Target Group:</span>
                  <span className="value">{application.targetGroup}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Awareness Program:</span>
                  <span className="value">{application.awarenessProgram === "yes" ? "Yes" : "No"}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Previous Experience:</span>
                  <span className="value">{application.previousExperience === "yes" ? "Yes" : "No"}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Submitted On:</span>
                  <span className="value">{new Date(application.submittedAt).toLocaleString()}</span>
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
                    setSelectedApplication(application);
                    setShowApproveModal(true);
                  }}
                >
                  <FiCheckCircle /> Approve
                </button>
                <button 
                  className="btn-reject"
                  onClick={() => {
                    onClose();
                    setSelectedApplication(application);
                    setShowRejectModal(true);
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

  // Approve Modal
  const ApproveModal = ({ application, onClose, onApprove }) => {
    const [notes, setNotes] = useState("");

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
              onClick={() => {
                onApprove(application.id);
                // In real app, save notes
              }}
            >
              Confirm Approval
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Reject Modal
  const RejectModal = ({ application, onClose, onReject }) => {
    const [reason, setReason] = useState("");
    const [otherReason, setOtherReason] = useState("");

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

  // Assign Coordinator Modal
  const AssignModal = ({ application, onClose, onAssign }) => {
    const [selectedCoordinator, setSelectedCoordinator] = useState("");
    const [scheduleDate, setScheduleDate] = useState(application?.eventDate || "");
    const [scheduleTime, setScheduleTime] = useState(application?.eventTime || "");

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
              Assign a coordinator for <strong>{application?.organizationName}</strong> blood drive.
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
        <button className="export-btn">
          <FiDownload /> Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Applications</span>
            <span className="stat-value">{stats.totalApplications}</span>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">
            <FiClock />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
        </div>
        <div className="stat-card approved">
          <div className="stat-icon">
            <FiCheckCircle />
          </div>
          <div className="stat-info">
            <span className="stat-label">Approved</span>
            <span className="stat-value">{stats.approved}</span>
          </div>
        </div>
        <div className="stat-card scheduled">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <div className="stat-info">
            <span className="stat-label">Scheduled</span>
            <span className="stat-value">{stats.scheduled}</span>
          </div>
        </div>
        <div className="stat-card completed">
          <div className="stat-icon">
            <FiAward />
          </div>
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{stats.completed}</span>
          </div>
        </div>
        <div className="stat-card donors">
          <div className="stat-icon">
            <FaTint />
          </div>
          <div className="stat-info">
            <span className="stat-label">Expected Donors</span>
            <span className="stat-value">{stats.totalDonors}</span>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="tabs-section">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Applications
          </button>
          <button 
            className={`tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
            {stats.pending > 0 && <span className="tab-badge">{stats.pending}</span>}
          </button>
          <button 
            className={`tab ${activeTab === "approved" ? "active" : ""}`}
            onClick={() => setActiveTab("approved")}
          >
            Approved
          </button>
          <button 
            className={`tab ${activeTab === "scheduled" ? "active" : ""}`}
            onClick={() => setActiveTab("scheduled")}
          >
            Scheduled
          </button>
          <button 
            className={`tab ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
          <button 
            className={`tab ${activeTab === "rejected" ? "active" : ""}`}
            onClick={() => setActiveTab("rejected")}
          >
            Rejected
          </button>
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
        <table className="applications-table">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Organization</th>
              <th>Contact</th>
              <th>Event Details</th>
              <th>Donors</th>
              <th>Status</th>
              <th>Coordinator</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedApplications.map(app => (
              <tr key={app.id} className={app.status}>
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
                <td>
                  {getStatusBadge(app.status)}
                </td>
                <td>
                  {app.assignedCoordinator ? (
                    <div className="coordinator-info">
                      <FiUserCheck className="coord-icon" />
                      <span>{app.assignedCoordinator}</span>
                    </div>
                  ) : (
                    <span className="not-assigned">Not assigned</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn view"
                      onClick={() => {
                        setSelectedApplication(app);
                        setShowDetailsModal(true);
                      }}
                      title="View Details"
                    >
                      <FiEye />
                    </button>
                    
                    {app.status === "approved" && (
                      <button 
                        className="action-btn assign"
                        onClick={() => {
                          setSelectedApplication(app);
                          setShowAssignModal(true);
                        }}
                        title="Assign Coordinator"
                      >
                        <FiUserCheck />
                      </button>
                    )}
                    
                    {app.status === "pending" && (
                      <>
                        <button 
                          className="action-btn approve"
                          onClick={() => {
                            setSelectedApplication(app);
                            setShowApproveModal(true);
                          }}
                          title="Approve"
                        >
                          <FiCheckCircle />
                        </button>
                        <button 
                          className="action-btn reject"
                          onClick={() => {
                            setSelectedApplication(app);
                            setShowRejectModal(true);
                          }}
                          title="Reject"
                        >
                          <FiXCircle />
                        </button>
                      </>
                    )}
                    
                    <button className="action-btn message" title="Send Message">
                      <FiMessageSquare />
                    </button>
                    
                    <button className="action-btn more">
                      <FiMoreVertical />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedApplications.length === 0 && (
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
      {showDetailsModal && (
        <DetailsModal 
          application={selectedApplication} 
          onClose={() => setShowDetailsModal(false)} 
        />
      )}

      {showApproveModal && (
        <ApproveModal 
          application={selectedApplication} 
          onClose={() => setShowApproveModal(false)}
          onApprove={handleApprove}
        />
      )}

      {showRejectModal && (
        <RejectModal 
          application={selectedApplication} 
          onClose={() => setShowRejectModal(false)}
          onReject={handleReject}
        />
      )}

      {showAssignModal && (
        <AssignModal 
          application={selectedApplication} 
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssignCoordinator}
        />
      )}
    </div>
  );
}