import { useState, useEffect, useMemo } from "react";
import {
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiTrash2,
  FiDownload,
  FiSearch,
  FiInbox,
  FiSend,
  FiRefreshCw,
  FiTag,
  FiCalendar,
  FiX,
  FiUserCheck,
  FiUserX,
  FiCornerUpRight,
  FiAlertCircle,
} from "react-icons/fi";
import { FaReply } from "react-icons/fa";
import Papa from "papaparse";
import "./contactus-management.scss";
import {
  deleteContactMessages,
  getContactMessages,
  updateContactStatus,
  replyToContact,
} from "../../../../services/adminServices";

export default function ContactManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const itemsPerPage = 10;

  // Priority derivation from subject
  const derivePriorityFromSubject = (subject) => {
    if (!subject) return "medium";
    const s = subject.toLowerCase();

    if (s.includes("emergency") || s.includes("urgent")) return "urgent";
    if (
      s.includes("blood drive") ||
      s.includes("partnership") ||
      s.includes("camp")
    )
      return "high";
    if (
      s.includes("donation") ||
      s.includes("donor") ||
      s.includes("volunteer")
    )
      return "high";
    if (s.includes("support") || s.includes("help") || s.includes("issue"))
      return "medium";

    return "low";
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getContactMessages();

      if (response.success) {
        // Process messages to add derived priority if not present
        const processedData = response.data.map((msg) => ({
          ...msg,
          priority: msg.priority || derivePriorityFromSubject(msg.subject),
          replies: msg.replies || [],
        }));
        setMessages(processedData);
      } else {
        setError(response.message || "Failed to fetch messages");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(async () => {
      await fetchMessages();
      setIsRefreshing(false);
    }, 2000);
  };

  const quickResponses = [
    {
      id: 1,
      title: "Donation Eligibility",
      content:
        "Thank you for your interest in blood donation. Regarding your query about donating while having a cold: Generally, you should wait until you've fully recovered from any illness before donating blood. This ensures both your safety and the recipient's safety. We recommend waiting at least 7 days after your symptoms have completely resolved. For more information, please visit our eligibility guidelines page.\n\nIf you have any other questions, feel free to ask!\n\nBest regards,\nBlood Donation Team",
    },
    {
      id: 2,
      title: "Registration Process",
      content:
        "Thank you for your interest in becoming a blood donor! Here's how to register:\n\n1. Visit our website and click on 'Become a Donor'\n2. Fill out the registration form with your details\n3. Complete the health screening questionnaire\n4. Choose your preferred donation center\n5. Schedule your first appointment\n\nWe'll send you a confirmation email with next steps. If you're already registered, you can log in to your account to schedule donations.\n\nBest regards,\nBlood Donation Team",
    },
    {
      id: 3,
      title: "Emergency Response",
      content:
        "We've received your emergency request and are prioritizing it. Our emergency response team has been notified and will contact you shortly. Please keep your phone accessible. If this is a life-threatening emergency, please call emergency services immediately (108).\n\nFor immediate assistance, you can also contact our emergency helpline: 108\n\nStay safe,\nBlood Donation Team",
    },
    {
      id: 4,
      title: "Blood Camp Inquiry",
      content:
        "Thank you for your interest in our blood donation camps. Here's the information about upcoming camps:\n\n• Weekly camps are held every Saturday at our main center\n• Mobile camps can be organized for organizations with 50+ donors\n• Corporate camps are available on weekdays\n\nPlease visit our 'Blood Camps' page for the complete schedule and locations.\n\nBest regards,\nBlood Donation Team",
    },
    {
      id: 5,
      title: "General Support",
      content:
        "Thank you for contacting our support team. We've received your query and will get back to you within 24-48 hours. If you need immediate assistance, please call our support helpline at 1800-XXX-XXXX.\n\nFor faster resolution, please ensure you've provided all relevant details about your query.\n\nBest regards,\nBlood Donation Support Team",
    },
  ];

  // Statistics
  const stats = useMemo(
    () => ({
      total: messages.length,
      unread: messages.filter((m) => m.status === "unread").length,
      read: messages.filter((m) => m.status === "read").length,
      replied: messages.filter((m) => m.replies && m.replies.length > 0).length,
      urgent: messages.filter((m) => m.priority === "urgent").length,
      registered: messages.filter((m) => m.userId).length,
      guest: messages.filter((m) => !m.userId).length,
    }),
    [messages],
  );

  // Categories based on subject analysis
  const getCategoryFromSubject = (subject) => {
    if (!subject) return "other";
    const s = subject.toLowerCase();
    if (s.includes("donat")) return "donation";
    if (s.includes("emerg")) return "emergency";
    if (s.includes("camp") || s.includes("drive")) return "camp";
    if (s.includes("support") || s.includes("help") || s.includes("issue"))
      return "support";
    if (s.includes("donor") || s.includes("volunteer")) return "donor";
    return "other";
  };

  const categories = useMemo(
    () => [
      { id: "all", label: "All", icon: <FiInbox />, count: messages.length },
      {
        id: "donation",
        label: "Donation",
        icon: <FiMessageSquare />,
        count: messages.filter(
          (m) => getCategoryFromSubject(m.subject) === "donation",
        ).length,
      },
      {
        id: "emergency",
        label: "Emergency",
        icon: <FiAlertCircle />,
        count: messages.filter(
          (m) => getCategoryFromSubject(m.subject) === "emergency",
        ).length,
      },
      {
        id: "support",
        label: "Support",
        icon: <FiPhone />,
        count: messages.filter(
          (m) => getCategoryFromSubject(m.subject) === "support",
        ).length,
      },
      {
        id: "donor",
        label: "Donor",
        icon: <FiUserCheck />,
        count: messages.filter(
          (m) => getCategoryFromSubject(m.subject) === "donor",
        ).length,
      },
      {
        id: "camp",
        label: "Camp",
        icon: <FiCalendar />,
        count: messages.filter(
          (m) => getCategoryFromSubject(m.subject) === "camp",
        ).length,
      },
    ],
    [messages],
  );

  // Filter logic
  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      // Category filter
      if (
        activeTab !== "all" &&
        getCategoryFromSubject(message.subject) !== activeTab
      )
        return false;

      // Status filter
      if (statusFilter !== "all") {
        if (statusFilter === "unread" && message.status !== "unread")
          return false;
        if (statusFilter === "read" && message.status !== "read") return false;
        if (
          statusFilter === "replied" &&
          (!message.replies || message.replies.length === 0)
        )
          return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          message.name?.toLowerCase().includes(query) ||
          message.email?.toLowerCase().includes(query) ||
          message.subject?.toLowerCase().includes(query) ||
          message.message?.toLowerCase().includes(query) ||
          (message.phone && message.phone.includes(query))
        );
      }
      return true;
    });
  }, [messages, activeTab, statusFilter, searchQuery]); // dependencies

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSelectMessage = (id) => {
    if (selectedMessages.includes(id)) {
      setSelectedMessages(selectedMessages.filter((msgId) => msgId !== id));
    } else {
      setSelectedMessages([...selectedMessages, id]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMessages(paginatedMessages.map((m) => m._id));
    } else {
      setSelectedMessages([]);
    }
  };

  const handleExport = () => {
    // Prepare the data to be exported
    const dataToExport = filteredMessages.map((message) => ({
      "Sender Name": message.name,
      Email: message.email,
      Phone: message.phone,
      Subject: message.subject,
      Message: message.message,
      Priority: message.priority,
      Status: message.status,
      "Date Submitted": new Date(message.createdAt).toLocaleString(),
    }));

    // Convert the data to CSV
    const csv = Papa.unparse(dataToExport);

    // Create a Blob with the CSV data
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    // Create a link to download the file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "contact_messages.csv"; // Set your desired filename
    link.click(); // Trigger the download
  };

  const handleMarkAsRead = async (id) => {
    try {
      const response = await updateContactStatus(id, "read");

      if (response.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === id ? { ...msg, status: "read" } : msg,
          ),
        );
      }
    } catch (err) {
      console.error("Mark as read error:", err);
      setError("Failed to mark as read");
    }
  };

  const handleMarkAsUnread = async (id) => {
    try {
      const response = await updateContactStatus(id, "unread");

      if (response.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === id ? { ...msg, status: "unread" } : msg,
          ),
        );
      }
    } catch (err) {
      console.error("Mark as unread error:", err);
      setError("Failed to mark as unread");
    }
  };

  const handleDelete = async () => {
    if (selectedMessages.length === 0) return;

    try {
      setIsSubmitting(true);

      const response = await deleteContactMessages(selectedMessages);

      if (response.success) {
        // Remove deleted messages from state
        setMessages((prev) =>
          prev.filter((msg) => !selectedMessages.includes(msg._id)),
        );

        setSelectedMessages([]);
        setShowDeleteModal(false);
      } else {
        setError(response.message || "Failed to delete messages");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Something went wrong while deleting");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTemplateSelect = (templateId) => {
    const template = quickResponses.find((t) => t.id === templateId);
    if (template) {
      setReplyText(template.content);
      setSelectedTemplate(templateId);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    try {
      setIsSubmitting(true);

      const response = await replyToContact(selectedMessage._id, replyText);

      if (response.success) {
        // Update UI instantly
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === selectedMessage._id
              ? {
                  ...msg,
                  replies: [
                    ...(msg.replies || []),
                    {
                      replyMessage: replyText,
                      repliedAt: new Date(),
                    },
                  ],
                  replied: true,
                  status: "in-progress",
                }
              : msg,
          ),
        );

        // Show success toast
        setSuccessMessage({
          message: "Reply sent successfully!",
          email: selectedMessage.email,
        });

        // Auto-hide after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000);

        setShowReplyModal(false);
        setReplyText("");
      }
    } catch (err) {
      setError("Failed to send reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "N/A";
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then; // Difference in milliseconds
    const diffMinutes = Math.floor(diffMs / (1000 * 60)); // Convert to minutes
    if (diffMinutes < 60) {
      return diffMinutes === 1 ? "1m ago" : `${diffMinutes}m ago`; // Show minutes if less than 60 minutes
    }
    const diffHours = Math.floor(diffMinutes / 60); // Convert to hours
    if (diffHours < 24) {
      return `${diffHours}h ago`; // Show hours if less than 24 hours
    }
    const diffDays = Math.floor(diffHours / 24); // Convert to days
    if (diffDays < 7) {
      return `${diffDays}d ago`; // Show days if less than 7 days
    }
    return then.toLocaleDateString(); // Show the full date if it's more than 7 days
  };

  const getPriorityBadge = (priority) => {
    const classes = {
      urgent: "urgent",
      high: "high",
      medium: "medium",
      low: "low",
    };
    return (
      <span className={`priority-badge ${classes[priority] || "medium"}`}>
        {priority || "medium"}
      </span>
    );
  };

  const getUserTypeBadge = (userId) => {
    if (userId) {
      return (
        <span className="user-badge registered">
          <FiUserCheck /> Registered
        </span>
      );
    }
    return (
      <span className="user-badge guest">
        <FiUserX /> Guest
      </span>
    );
  };

  // Modal Components
  const MessageDetailModal = ({ message, onClose }) => {
    if (!message) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content message-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-drag-handle" />
          <div className="modal-header">
            <h3>{message.subject}</h3>
            <button className="close-btn" onClick={onClose}>
              <FiX />
            </button>
          </div>
          <div className="modal-body">
            <div className="sender-info">
              <div className="sender-avatar">
                {message.userId ? (
                  <FiUserCheck />
                ) : (
                  message.name?.charAt(0) || "G"
                )}
              </div>
              <div className="sender-details">
                <h4>{message.name}</h4>
                <span className="sender-email">
                  <FiMail /> {message.email}
                </span>
                {message.phone && (
                  <span className="sender-phone">
                    <FiPhone /> {message.phone}
                  </span>
                )}
                <div className="user-type-indicator">
                  {getUserTypeBadge(message.userId)}
                </div>
              </div>
            </div>

            {/* Message Metadata */}
            <div className="message-metadata">
              <span className="metadata-item">
                <FiClock /> Submitted:{" "}
                {new Date(message.createdAt).toLocaleString()}
              </span>
              <span className="metadata-item">
                <FiTag /> Priority: {message.priority}
              </span>
              <span className="metadata-item">
                <FiCheckCircle /> Status: {message.status}
              </span>
            </div>

            <div className="message-content">
              <p>{message.message}</p>
            </div>

            {/* Replies Section */}
            {message.replies && message.replies.length > 0 && (
              <div className="replies-section">
                <h5>Replies ({message.replies.length})</h5>
                {message.replies.map((reply, index) => (
                  <div key={index} className="reply-item">
                    <div className="reply-header">
                      <FiCornerUpRight />
                      <span className="reply-date">
                        {new Date(reply.repliedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="reply-content">{reply.replyMessage}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="meta-tags">
              {getPriorityBadge(message.priority)}
              <span className="time">
                <FiClock /> {getTimeAgo(message.createdAt)}
              </span>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-cancel" onClick={onClose}>
              Close
            </button>
            <button
              className="btn-send"
              onClick={() => {
                onClose();
                setSelectedMessage(message);
                setShowReplyModal(true);
              }}
            >
              <FaReply /> Reply
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DeleteModal = () => (
    <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
      <div
        className="modal-content delete-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-drag-handle" />
        <div className="delete-icon">
          <FiTrash2 />
        </div>
        <h3>Delete Messages</h3>
        <p>
          Are you sure you want to delete {selectedMessages.length} message(s)?
        </p>
        <p className="delete-warning">This action cannot be undone.</p>
        <div className="modal-footer">
          <button
            className="btn-cancel"
            onClick={() => setShowDeleteModal(false)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="btn-delete"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );

  if (loading && messages.length === 0) {
    return (
      <div className="admin-contact-management">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-contact-management">
      {/* Header */}
      <div className="header-section">
        <div className="title-area">
          <h1 className="page-title">
            <FiMail /> Contact Management
          </h1>
          <p className="page-subtitle">
            {stats.unread} unread • {stats.registered} registered •{" "}
            {stats.guest} guests
          </p>
        </div>
        <div className="header-actions">
          <button className="action-btn-secondary" onClick={handleRefresh}>
            <FiRefreshCw className={isRefreshing ? "spin" : ""} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button className="action-btn-primary" onClick={handleExport}>
            <FiDownload /> Export
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <FiAlertCircle />
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <FiX />
          </button>
        </div>
      )}
      {successMessage && (
        <div className="success-toast">
          <FiCheckCircle />
          <div>
            <strong>{successMessage.message}</strong>
            <p>Your reply has been sent to {successMessage.email}</p>
          </div>
          <button onClick={() => setSuccessMessage(null)}>
            <FiX />
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card total">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card unread">
          <span className="stat-value">{stats.unread}</span>
          <span className="stat-label">Unread</span>
        </div>
        <div className="stat-card replied">
          <span className="stat-value">{stats.replied}</span>
          <span className="stat-label">Replied</span>
        </div>
        <div className="stat-card urgent">
          <span className="stat-value">{stats.urgent}</span>
          <span className="stat-label">Urgent</span>
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        <div className="search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by name, email, subject, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filters */}
        <div className="status-filters">
          <button
            className={`status-btn ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            All
          </button>
          <button
            className={`status-btn unread ${statusFilter === "unread" ? "active" : ""}`}
            onClick={() => setStatusFilter("unread")}
          >
            Unread ({stats.unread})
          </button>
          <button
            className={`status-btn read ${statusFilter === "read" ? "active" : ""}`}
            onClick={() => setStatusFilter("read")}
          >
            Read ({stats.read})
          </button>
          <button
            className={`status-btn replied ${statusFilter === "replied" ? "active" : ""}`}
            onClick={() => setStatusFilter("replied")}
          >
            Replied ({stats.replied})
          </button>
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`pill ${activeTab === cat.id ? "active" : ""}`}
              onClick={() => setActiveTab(cat.id)}
            >
              {cat.icon}
              <span>{cat.label}</span>
              <b>{cat.count}</b>
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedMessages.length > 0 && (
        <div className="bulk-actions-bar">
          <span>{selectedMessages.length} selected</span>
          <div className="actions">
            <button onClick={() => setShowDeleteModal(true)} title="Delete">
              <FiTrash2 />
            </button>
            <button onClick={() => setSelectedMessages([])} title="Clear">
              <FiX />
            </button>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: "30px" }}>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedMessages.length === paginatedMessages.length &&
                    paginatedMessages.length > 0
                  }
                />
              </th>
              <th>Sender</th>
              <th>Contact</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMessages.length > 0 ? (
              paginatedMessages.map((msg) => (
                <tr
                  key={msg._id}
                  className={msg.status === "unread" ? "unread-row" : ""}
                  onClick={() => {
                    setSelectedMessage(msg);
                    setShowMessageModal(true);
                  }}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(msg._id)}
                      onChange={() => handleSelectMessage(msg._id)}
                    />
                  </td>
                  <td>
                    <div className="name-cell">
                      <span className="sender-name">{msg.name}</span>
                      {msg.status === "unread" && (
                        <span className="unread-dot" />
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <span className="contact-email">
                        <FiMail /> {msg.email}
                      </span>
                      {msg.phone && (
                        <span className="contact-phone">
                          <FiPhone /> {msg.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="subject-cell">
                      {msg.subject}
                      <span className="preview">
                        {msg.message?.substring(0, 40)}...
                      </span>
                    </div>
                  </td>
                  <td>{getPriorityBadge(msg.priority)}</td>
                  <td>
                    <div className="status-cell">
                      <span className={`status-badge ${msg.status}`}>
                        {msg.status}
                      </span>
                      {msg.replies?.length > 0 && (
                        <span
                          className="replied-badge"
                          title={`${msg.replies.length} replies`}
                        >
                          <FaReply size={12} />
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="date-cell">
                      <FiClock /> {getTimeAgo(msg.createdAt)}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="row-actions">
                      <button
                        onClick={() => {
                          setSelectedMessage(msg);
                          setShowMessageModal(true);
                        }}
                        title="View"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMessage(msg);
                          setShowReplyModal(true);
                        }}
                        title="Reply"
                      >
                        <FaReply />
                      </button>
                      {msg.status === "unread" ? (
                        <button
                          onClick={() => handleMarkAsRead(msg._id)}
                          title="Mark as Read"
                        >
                          <FiCheckCircle />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkAsUnread(msg._id)}
                          title="Mark as Unread"
                        >
                          <FiXCircle />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  <div className="no-results">
                    <FiInbox size={48} />
                    <h3>No messages found</h3>
                    <p>Try adjusting your filters or search query</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="mobile-list-view">
        {paginatedMessages.length > 0 ? (
          paginatedMessages.map((msg) => (
            <div
              key={msg._id}
              className={`message-card ${msg.status === "unread" ? "unread" : ""}`}
              onClick={() => {
                setSelectedMessage(msg);
                setShowMessageModal(true);
              }}
            >
              <div className="card-header">
                <div className="avatar">
                  {msg.userId ? <FiUserCheck /> : msg.name?.charAt(0) || "G"}
                </div>
                <div className="meta">
                  <h4>{msg.name}</h4>
                  <div className="meta-row">
                    <span className="time">
                      <FiClock /> {getTimeAgo(msg.createdAt)}
                    </span>
                    {getUserTypeBadge(msg.userId)}
                  </div>
                </div>
                {msg.replies?.length > 0 && (
                  <span className="replied-icon" title="Replied">
                    <FaReply />
                  </span>
                )}
              </div>
              <div className="card-body">
                <h5>{msg.subject}</h5>
                <p>{msg.message?.substring(0, 60)}...</p>
                <div className="contact-info">
                  <span>
                    <FiMail /> {msg.email}
                  </span>
                  {msg.phone && (
                    <span>
                      <FiPhone /> {msg.phone}
                    </span>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <button
                  className="card-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    msg.status === "unread"
                      ? handleMarkAsRead(msg._id)
                      : handleMarkAsUnread(msg._id);
                  }}
                >
                  {msg.status === "unread" ? "Mark Read" : "Mark Unread"}
                </button>
                <button
                  className="card-action-btn reply"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMessage(msg);
                    setShowReplyModal(true);
                  }}
                >
                  <FaReply /> Reply
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <FiInbox size={48} />
            <h3>No messages found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-nav"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ←
          </button>
          <span className="page-info">
            {currentPage} of {totalPages}
          </span>
          <button
            className="page-nav"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      )}

      {/* Modals */}
      {showMessageModal && (
        <MessageDetailModal
          message={selectedMessage}
          onClose={() => setShowMessageModal(false)}
        />
      )}
      {showReplyModal && (
        <ReplyModal
          message={selectedMessage}
          replyText={replyText}
          setReplyText={setReplyText}
          selectedTemplate={selectedTemplate}
          handleTemplateSelect={handleTemplateSelect}
          handleSendReply={handleSendReply}
          isSubmitting={isSubmitting}
          quickResponses={quickResponses}
          onClose={() => {
            setShowReplyModal(false);
            setReplyText("");
            setSelectedTemplate("");
          }}
        />
      )}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
}

const ReplyModal = ({
  message,
  replyText,
  setReplyText,
  selectedTemplate,
  handleTemplateSelect,
  handleSendReply,
  isSubmitting,
  quickResponses,
  onClose,
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content reply-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-drag-handle" />
        <div className="modal-header">
          <h3>Reply to {message?.name}</h3>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="modal-body">
          {/* Quick Templates */}
          <div className="quick-templates">
            <label>Quick Templates</label>
            <select
              onChange={(e) => handleTemplateSelect(Number(e.target.value))}
              value={selectedTemplate}
            >
              <option value="">Select a quick response...</option>
              {quickResponses.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.title}
                </option>
              ))}
            </select>
          </div>

          {/* Original Message Preview */}
          <div className="original-message">
            <div className="original-header">
              <strong>Original Message:</strong>
              <span className="original-subject">{message?.subject}</span>
            </div>
            <p className="original-preview">
              {message?.message?.substring(0, 150)}...
            </p>
          </div>

          {/* Reply Input */}
          <div className="reply-form">
            <div className="form-group">
              <label>Your Reply</label>
              <textarea
                placeholder="Type your reply..."
                rows="6"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>
          </div>

          {/* Reply Info */}
          <div className="reply-to-info">
            <span>
              <FiMail /> To: {message?.email}
            </span>
            {message?.phone && (
              <span>
                <FiPhone /> {message.phone}
              </span>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-send"
            onClick={handleSendReply}
            disabled={!replyText.trim() || isSubmitting}
          >
            <FiSend /> {isSubmitting ? "Sending..." : "Send Reply"}
          </button>
        </div>
      </div>
    </div>
  );
};
