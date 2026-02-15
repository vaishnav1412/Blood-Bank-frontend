import React, { useState } from "react";
import { 
  FiMail, 
  FiPhone, 
  FiUser, 
  FiMessageSquare,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiTrash2,
  FiDownload,
  FiFilter,
  FiSearch,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiArchive,
  FiInbox,
  FiSend,
  FiPaperclip,
  FiMoreVertical,
  FiRefreshCw,
  FiTag,
  FiCalendar,
  FiMapPin,
  FiBriefcase,
  FiX
} from "react-icons/fi";
import { 
  FaReply
} from "react-icons/fa";
import "./contactus-management.scss";

export default function ContactManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock contact messages data
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul.sharma@email.com",
      phone: "+91 98765 43210",
      subject: "Blood Donation Query",
      message: "I want to donate blood but I have a cold. Can I still donate? Please advise on the eligibility criteria.",
      status: "unread",
      priority: "high",
      category: "donation",
      submittedAt: "2024-03-15T10:30:00",
      replied: false,
      tags: ["donation", "eligibility"],
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya.patel@email.com",
      phone: "+91 98765 43211",
      subject: "Become a Donor",
      message: "I would like to register as a blood donor. Please guide me through the registration process.",
      status: "read",
      priority: "medium",
      category: "donor",
      submittedAt: "2024-03-14T14:20:00",
      replied: true,
      tags: ["registration"],
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit.kumar@email.com",
      phone: "+91 98765 43212",
      subject: "Emergency Request",
      message: "URGENT: Need O- blood for patient at City Hospital. Please contact immediately.",
      status: "unread",
      priority: "urgent",
      category: "emergency",
      submittedAt: "2024-03-15T09:15:00",
      replied: false,
      tags: ["emergency"],
    },
    {
      id: 4,
      name: "Neha Singh",
      email: "neha.singh@email.com",
      phone: "+91 98765 43213",
      subject: "Organize Blood Drive",
      message: "Our college wants to organize a blood donation camp. Please provide details.",
      status: "read",
      priority: "medium",
      category: "camp",
      submittedAt: "2024-03-13T11:45:00",
      replied: true,
      tags: ["camp"],
    },
    {
      id: 5,
      name: "Vikram Mehta",
      email: "vikram.mehta@email.com",
      phone: "+91 98765 43214",
      subject: "Technical Support",
      message: "I'm unable to login to my donor account. Getting error message.",
      status: "unread",
      priority: "low",
      category: "support",
      submittedAt: "2024-03-14T16:30:00",
      replied: false,
      tags: ["tech"],
    },
  ]);

  // Quick response templates
  const quickResponses = [
    { id: 1, title: "Donation Eligibility", content: "Thank you for your interest..." },
    { id: 2, title: "Registration Process", content: "To register as a donor..." },
  ];

  // Statistics
  const stats = {
    total: messages.length,
    unread: messages.filter(m => m.status === "unread").length,
    read: messages.filter(m => m.status === "read").length,
    replied: messages.filter(m => m.replied).length,
    urgent: messages.filter(m => m.priority === "urgent").length,
  };

  // Categories
  const categories = [
    { id: "all", label: "All", icon: <FiInbox />, count: messages.length },
    { id: "donation", label: "Donation", icon: <FiMessageSquare />, count: messages.filter(m => m.category === "donation").length },
    { id: "emergency", label: "Emergency", icon: <FiXCircle />, count: messages.filter(m => m.category === "emergency").length },
    { id: "support", label: "Support", icon: <FiPhone />, count: messages.filter(m => m.category === "support").length },
  ];

  // Filter logic
  const filteredMessages = messages.filter(message => {
    if (activeTab !== "all" && message.category !== activeTab) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        message.name.toLowerCase().includes(query) ||
        message.subject.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Handlers
  const handleSelectMessage = (id) => {
    if (selectedMessages.includes(id)) {
      setSelectedMessages(selectedMessages.filter(msgId => msgId !== id));
    } else {
      setSelectedMessages([...selectedMessages, id]);
    }
  };

  const handleMarkAsRead = (id) => {
    setMessages(messages.map(msg => msg.id === id ? { ...msg, status: "read" } : msg));
  };

  const handleDelete = () => {
    setMessages(messages.filter(msg => !selectedMessages.includes(msg.id)));
    setSelectedMessages([]);
    setShowDeleteModal(false);
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffHours = Math.floor((now - then) / 3600000);
    if (diffHours < 24) return `${diffHours}h ago`;
    return then.toLocaleDateString();
  };

  const getPriorityBadge = (priority) => {
    const classes = {
      urgent: "urgent",
      high: "high",
      medium: "medium",
      low: "low"
    };
    return <span className={`priority-badge ${classes[priority]}`}>{priority}</span>;
  };

  // Modal Components
  const MessageDetailModal = ({ message, onClose }) => {
    if (!message) return null;
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content message-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-drag-handle" />
          <div className="modal-header">
            <h3>{message.subject}</h3>
            <button className="close-btn" onClick={onClose}><FiX /></button>
          </div>
          <div className="modal-body">
            <div className="sender-info">
              <div className="sender-avatar">{message.name.charAt(0)}</div>
              <div>
                <h4>{message.name}</h4>
                <span className="sender-email">{message.email}</span>
              </div>
            </div>
            <div className="message-content">
              <p>{message.message}</p>
            </div>
            <div className="meta-tags">
              {getPriorityBadge(message.priority)}
              <span className="time"><FiClock /> {getTimeAgo(message.submittedAt)}</span>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-cancel" onClick={onClose}>Close</button>
            <button className="btn-send" onClick={() => { onClose(); setShowReplyModal(true); }}>
              <FaReply /> Reply
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ReplyModal = ({ message, onClose }) => {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content reply-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-drag-handle" />
          <div className="modal-header">
            <h3>Reply to {message?.name}</h3>
            <button className="close-btn" onClick={onClose}><FiX /></button>
          </div>
          <div className="modal-body">
            <textarea placeholder="Type your reply..." rows="5" />
          </div>
          <div className="modal-footer">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-send"><FiSend /> Send</button>
          </div>
        </div>
      </div>
    );
  };

  const DeleteModal = () => (
    <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
      <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-drag-handle" />
        <div className="delete-icon"><FiTrash2 /></div>
        <h3>Delete Messages</h3>
        <p>Are you sure you want to delete {selectedMessages.length} messages?</p>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          <button className="btn-delete" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-contact-management">
      {/* Header */}
      <div className="header-section">
        <div className="title-area">
          <h1 className="page-title"><FiMail /> Contact Management</h1>
          <p className="page-subtitle">{stats.unread} unread messages</p>
        </div>
        <div className="header-actions">
          <button className="action-btn-secondary"><FiRefreshCw /></button>
          <button className="action-btn-primary"><FiDownload /> Export</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
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

      {/* Filters */}
      <div className="controls-section">
        <div className="search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Category Pills - Scrollable on mobile */}
        <div className="category-pills">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`pill ${activeTab === cat.id ? 'active' : ''}`}
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
            <button onClick={() => setShowDeleteModal(true)}><FiTrash2 /></button>
            <button onClick={() => setSelectedMessages([])}><FiX /></button>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  onChange={(e) => e.target.checked ? setSelectedMessages(filteredMessages.map(m => m.id)) : setSelectedMessages([])} 
                />
              </th>
              <th>Sender</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.map(msg => (
              <tr key={msg.id} className={msg.status === 'unread' ? 'unread-row' : ''}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedMessages.includes(msg.id)}
                    onChange={() => handleSelectMessage(msg.id)}
                  />
                </td>
                <td>
                  <div className="sender-cell">
                    <span className="sender-name">{msg.name}</span>
                    <span className="sender-email">{msg.email}</span>
                  </div>
                </td>
                <td>
                  <div className="subject-cell">
                    {msg.subject}
                    <span className="preview">{msg.message.substring(0, 30)}...</span>
                  </div>
                </td>
                <td>{getPriorityBadge(msg.priority)}</td>
                <td><FiClock /> {getTimeAgo(msg.submittedAt)}</td>
                <td>
                  <div className="row-actions">
                    <button onClick={() => { setSelectedMessage(msg); setShowMessageModal(true); }}><FiEye /></button>
                    <button onClick={() => { setSelectedMessage(msg); setShowReplyModal(true); }}><FaReply /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="mobile-list-view">
        {filteredMessages.map(msg => (
          <div 
            key={msg.id} 
            className={`message-card ${msg.status === 'unread' ? 'unread' : ''}`}
            onClick={() => { setSelectedMessage(msg); setShowMessageModal(true); }}
          >
            <div className="card-header">
              <div className="avatar">{msg.name.charAt(0)}</div>
              <div className="meta">
                <h4>{msg.name}</h4>
                <span className="time">{getTimeAgo(msg.submittedAt)}</span>
              </div>
              {getPriorityBadge(msg.priority)}
            </div>
            <div className="card-body">
              <h5>{msg.subject}</h5>
              <p>{msg.message.substring(0, 60)}...</p>
            </div>
            <div className="card-footer">
              <button className="card-action-btn" onClick={(e) => { e.stopPropagation(); handleMarkAsRead(msg.id); }}>
                {msg.status === 'unread' ? 'Mark Read' : 'Mark Unread'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showMessageModal && <MessageDetailModal message={selectedMessage} onClose={() => setShowMessageModal(false)} />}
      {showReplyModal && <ReplyModal message={selectedMessage} onClose={() => setShowReplyModal(false)} />}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
}