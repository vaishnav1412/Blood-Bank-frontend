import { useState, useEffect } from "react";
import {
  FaClock,
  FaTimes,
  FaSpinner,
  FaUserShield,
  FaInbox,
  FaReply,
  FaUser,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { getMyContactHistory } from "../../../services/donorServices";
import "./contact-chat.scss";

const ContactChat = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedThreads, setExpandedThreads] = useState({});

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getMyContactHistory();
      
      if (response && response.success) {
        // Sort by most recent activity
        const sorted = response.data.sort((a, b) => 
          new Date(b.lastRepliedAt || b.createdAt) - new Date(a.lastRepliedAt || a.createdAt)
        );
        setConversations(sorted);
      } else {
        setConversations([]);
        if (response?.message) {
          setError(response.message);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to load conversations");
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleThread = (convId) => {
    setExpandedThreads(prev => ({
      ...prev,
      [convId]: !prev[convId]
    }));
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      'unread': { 
        text: 'Pending', 
        class: 'status-pending',
        icon: <FaClock /> 
      },
      'read': { 
        text: 'Seen', 
        class: 'status-seen',
        icon: <FaCheckCircle /> 
      },
      'in-progress': { 
        text: 'In Progress', 
        class: 'status-progress',
        icon: <FaSpinner /> 
      },
      'closed': { 
        text: 'Resolved', 
        class: 'status-resolved',
        icon: <FaCheckCircle /> 
      }
    };
    return badges[status] || badges['unread'];
  };

  // Show loading state
  if (loading) {
    return (
      <div className="contact-chat-container">
        <div className="chat-header">
          <h3><FaInbox /> Your Conversations</h3>
        </div>
        <div className="loading-state">
          <FaSpinner className="spin" size={32} />
          <p>Loading your conversations...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="contact-chat-container">
        <div className="chat-header">
          <h3><FaInbox /> Your Conversations</h3>
        </div>
        <div className="error-state">
          <FaExclamationCircle size={48} />
          <p>{error}</p>
          <button onClick={fetchConversations} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Don't show if no conversations
  if (conversations.length === 0) {
    return null;
  }

  return (
    <div className="contact-chat-container  shadow-md shadow-stone-400/80">
      <div className="chat-header bg-gradient-to-r from-pink-600 via-pink-500 to-pink-400">
        <div className="header-left">
          <FaInbox />
          <h3>Your Conversations</h3>
        </div>
        <div className="header-right">
          <span className="badge">{conversations.length} Total</span>
          <button onClick={fetchConversations} className="refresh-btn" title="Refresh">
            <FaSpinner className={loading ? "spin" : ""} />
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {conversations.map((conv, idx) => {
          const status = getStatusBadge(conv.status);
          const hasReplies = conv.replies && conv.replies.length > 0;
          const isExpanded = expandedThreads[conv._id] || false;
          
          return (
            <div key={conv._id || idx} className="conversation-card">
              {/* Main Message Preview */}
              <div 
                className="message-preview"
                onClick={() => toggleThread(conv._id)}
              >
                <div className="preview-left">
                  <div className="avatar user-avatar">
                    <FaUser />
                  </div>
                  <div className="preview-content">
                    <div className="preview-header">
                      <span className="subject">{conv.subject || 'No Subject'}</span>
                      <span className={`status-badge ${status.class}`}>
                        {status.icon} {status.text}
                      </span>
                    </div>
                    <p className="preview-text">
                      {conv.message?.substring(0, 60)}
                      {conv.message?.length > 60 ? '...' : ''}
                    </p>
                    <div className="preview-meta">
                      <span className="time">
                        <FaClock /> {formatTime(conv.createdAt)}
                      </span>
                      {hasReplies && (
                        <span className="reply-count">
                          <FaReply /> {conv.replies.length} {conv.replies.length === 1 ? 'reply' : 'replies'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="preview-right">
                  <button className={`expand-btn ${isExpanded ? 'expanded' : ''}`}>
                    ▼
                  </button>
                </div>
              </div>

              {/* Expanded Conversation Thread */}
              {isExpanded && (
                <div className="conversation-thread">
                  {/* User's Original Message */}
                  <div className="message-wrapper user-message">
                    <div className="message-avatar">
                      <FaUser />
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="sender">You</span>
                        <span className="time">{formatTime(conv.createdAt)}</span>
                      </div>
                      <div className="message-bubble">
                        <strong className="message-subject">{conv.subject}</strong>
                        <p className="message-text">{conv.message}</p>
                      </div>
                    </div>
                  </div>

                  {/* Admin Replies */}
                  {conv.replies && conv.replies.length > 0 && (
                    <div className="replies-section">
                      {conv.replies.map((reply, index) => (
                        <div key={index} className="message-wrapper admin-message">
                          <div className="message-avatar admin-avatar">
                            <FaUserShield />
                          </div>
                          <div className="message-content">
                            <div className="message-header">
                              <span className="sender">
                                <FaUserShield /> Admin Support
                              </span>
                              <span className="time">{formatTime(reply.repliedAt)}</span>
                            </div>
                            <div className="message-bubble admin-bubble">
                              <p className="message-text">{reply.replyMessage}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Conversation Footer */}
                  <div className="conversation-footer">
                    {conv.status !== 'closed' && (
                      <p className="waiting-message">
                        Waiting for admin response...
                      </p>
                    )}
                    {conv.status === 'closed' && (
                      <p className="resolved-message">
                        This conversation has been resolved.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactChat;