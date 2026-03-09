import { useState, useEffect, useCallback, memo } from "react";
import {
  FaHeart,
  FaImages,
  FaUsers,
  FaAward,
  FaPlay,
  FaInstagram,
  FaShareAlt,
  FaHeart as FaSolidHeart,
  FaQuoteLeft,
  FaMapMarkerAlt,
  FaRegCommentDots,
  FaRegBookmark,
  FaBookmark,
  FaDownload,
  FaExpand,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaFacebookF,
  FaTwitter,
  FaLink,
  FaRegClock,
  FaEye,
  FaStar,
  FaWhatsapp,
} from "react-icons/fa";
import "./donation-gallery.scss";
import WrapperSection from "../wrapper-section/wrapper-section-component";
import { getGalleryItems, likeGalleryItem ,commentOnItem} from "../../../services/donorServices";


// --- HELPER FUNCTIONS ---

const getVideoThumbnail = (item) => {
  if (item?.thumbnail) return item.thumbnail;
  if (item?.image) return item.image;
  if (item?.videoUrl && item.videoUrl.includes("cloudinary.com")) {
    return item.videoUrl.replace(/\.(mp4|mov|avi|webm)$/, ".jpg");
  }
  return "https://via.placeholder.com/600x400?text=Video";
};

// --- SUB-COMPONENTS ---

// Add this new component for auth warning modal
const AuthWarningModal = ({ show, onClose, action }) => {
  if (!show) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-warning-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FaTimes /></button>
        <div className="warning-icon">🔒</div>
        <h3>Login Required</h3>
        <p>Please log in to {action} this item.</p>
        <div className="warning-actions">
          <button className="warning-btn cancel" onClick={onClose}>Cancel</button>
          <button className="warning-btn login" onClick={() => {
            // Redirect to login page
            window.location.href = '/login';
          }}>Log In</button>
        </div>
      </div>
    </div>
  );
};

// Gallery Stats Header Component
const GalleryStatsHeader = ({ totalLikes, totalComments, totalViews, totalItems }) => {
  return (
    <div className="gallery-stats-header">
      <div className="stats-container">
        <div className="stat-item">
          <FaHeart className="stat-icon" />
          <div className="stat-info">
            <span className="stat-value">{totalLikes.toLocaleString()}</span>
            <span className="stat-label">Total Likes</span>
          </div>
        </div>
        <div className="stat-item">
          <FaRegCommentDots className="stat-icon" />
          <div className="stat-info">
            <span className="stat-value">{totalComments.toLocaleString()}</span>
            <span className="stat-label">Comments</span>
          </div>
        </div>
        <div className="stat-item">
          <FaEye className="stat-icon" />
          <div className="stat-info">
            <span className="stat-value">{totalViews.toLocaleString()}</span>
            <span className="stat-label">Views</span>
          </div>
        </div>
        <div className="stat-item">
          <FaImages className="stat-icon" />
          <div className="stat-info">
            <span className="stat-value">{totalItems}</span>
            <span className="stat-label">Total Items</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const GallerySkeleton = () => (
  <div className="gallery-grid">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="gallery-item skeleton">
        <div className="item-media skeleton-box" style={{ height: "200px" }} />
        <div className="item-content" style={{ padding: "1rem" }}>
          <div className="skeleton-text" style={{ width: "60%" }} />
          <div className="skeleton-text" style={{ width: "90%", marginTop: "0.5rem" }} />
        </div>
      </div>
    ))}
  </div>
);

const ShareModal = ({ show, item, onClose }) => {
  if (!show || !item) return null;
  const shareUrl = `${window.location.origin}/gallery/${item._id || item.id}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FaTimes /></button>
        <h3>Share this {item.type}</h3>
        <div className="share-preview">
          <img src={item.thumbnail || item.image || getVideoThumbnail(item)} alt={item.title} />
          <div className="preview-info">
            <h4>{item.title}</h4>
            <p>{item.description?.substring(0, 50)}...</p>
          </div>
        </div>
        <div className="share-options">
          <button className="share-option">
            <div className="option-icon facebook"><FaFacebookF /></div>
            <span>Facebook</span>
          </button>
          <button className="share-option">
            <div className="option-icon twitter"><FaTwitter /></div>
            <span>Twitter</span>
          </button>
          <button className="share-option">
            <div className="option-icon whatsapp"><FaWhatsapp /></div>
            <span>WhatsApp</span>
          </button>
        </div>
        <div className="share-link">
          <input type="text" value={shareUrl} readOnly />
          <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(shareUrl); alert("Link copied!"); }}>
            <FaLink /> Copy
          </button>
        </div>
      </div>
    </div>
  );
};

const CommentsModal = ({ show, item, onClose, onSubmit, commentText, setCommentText, isAuthenticated, showAuthWarning }) => {
  if (!show || !item) return null;
  const comments = item.comments || [];

  const handleCommentSubmit = () => {
    if (!isAuthenticated) {
      showAuthWarning('comment');
      return;
    }
    onSubmit(item._id || item.id);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && isAuthenticated) {
      onSubmit(item._id || item.id);
    } else if (e.key === "Enter" && !isAuthenticated) {
      showAuthWarning('comment');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="comments-modal" onClick={(e) => e.stopPropagation()}>
        <div className="comments-header">
          <h3>Comments ({comments.length})</h3>
          <button className="close-btn" onClick={onClose}><FaTimes /></button>
        </div>
        <div className="comments-list">
          {comments.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>No comments yet.</p>
          ) : (
            comments.map((comment, idx) => (
              <div key={comment.id || idx} className="comment-item">
                <div className="comment-avatar">{comment.user?.charAt(0) || "U"}</div>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-user">{comment.user || "Anonymous"}</span>
                    <span className="comment-time">{comment.time || "Just now"}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="comment-input">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={isAuthenticated ? "Write a comment..." : "Login to comment..."}
            onKeyPress={handleKeyPress}
            disabled={!isAuthenticated}
          />
          <button 
            className={`send-btn ${!isAuthenticated ? 'disabled' : ''}`} 
            onClick={handleCommentSubmit}
            disabled={!isAuthenticated}
          >
            Send
          </button>
        </div>
        {!isAuthenticated && (
          <p className="login-prompt" style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
            Please <a href="/login" style={{ color: '#4CAF50' }}>login</a> to comment
          </p>
        )}
      </div>
    </div>
  );
};

const FullscreenViewer = ({ show, item, onClose, onPrev, onNext, isLiked, onLike, isAuthenticated, showAuthWarning }) => {
  if (!show || !item) return null;

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      showAuthWarning('like');
      return;
    }
    onLike(item._id || item.id);
  };

  return (
    <div className="fullscreen-viewer">
      <div className="viewer-header">
        <button className="header-btn" onClick={onClose}><FaTimes /></button>
        <div className="header-controls">
          <button className="header-btn"><FaDownload /></button>
          <button className="header-btn"><FaShareAlt /></button>
        </div>
      </div>
      <button className="nav-btn prev" onClick={onPrev}><FaChevronLeft /></button>
      <button className="nav-btn next" onClick={onNext}><FaChevronRight /></button>
      
      <div className="viewer-content">
        {item.type === "video" ? (
           <video 
             key={item._id} 
             src={item.videoUrl} 
             className="viewer-image" 
             controls 
             autoPlay 
             playsInline
             muted
           />
        ) : (
           <img src={item.image} alt={item.title} className="viewer-image" />
        )}
      </div>
      
      <div className="viewer-footer">
        <div className="viewer-info">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
        <div className="viewer-actions">
          <button 
            className={`action ${isLiked ? 'active' : ''} ${!isAuthenticated ? 'disabled' : ''}`} 
            onClick={handleLikeClick}
          >
            <FaHeart /> <span>{item.likes || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Memoized Gallery Item
const GalleryItem = memo(({ 
  item, 
  isLiked, 
  isSaved, 
  isHovered, 
  mousePosition, 
  onHover, 
  onLike, 
  onSave, 
  onFullscreen, 
  onShare,
  onComment,
  isAuthenticated,
  showAuthWarning
}) => {
  
  const transformStyle = isHovered
    ? `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg) translateY(-10px)`
    : "none";

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showAuthWarning('like');
      return;
    }
    onLike(item._id || item.id);
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showAuthWarning('comment');
      return;
    }
    onComment(item);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showAuthWarning('save');
      return;
    }
    onSave(item._id || item.id);
  };

  return (
    <div
      className={`gallery-item ${item.type}-item ${!isAuthenticated ? 'unauthenticated' : ''}`}
      onMouseEnter={() => onHover(item._id || item.id)}
      onMouseLeave={() => onHover(null)}
      style={{ transform: transformStyle }}
    >
      {/* PHOTO ITEM */}
      {(item.type === "photo" || !item.type) && (
        <>
          <div className="item-media">
            <img src={item.thumbnail || item.image} alt={item.title} loading="lazy" className="media-image" />
            <div className="media-overlay">
              <div className="overlay-gradient" />
              <div className="quick-actions">
                <button 
                  className={`action-btn ${isLiked ? 'active' : ''} ${!isAuthenticated ? 'disabled' : ''}`} 
                  onClick={handleLikeClick}
                >
                  <FaHeart /> <span>{item.likes || 0}</span>
                </button>
                <button 
                  className={`action-btn ${!isAuthenticated ? 'disabled' : ''}`} 
                  onClick={handleCommentClick}
                >
                  <FaRegCommentDots /> <span>{item.comments?.length || 0}</span>
                </button>
                <button 
                  className={`action-btn ${isSaved ? 'active' : ''} ${!isAuthenticated ? 'disabled' : ''}`} 
                  onClick={handleSaveClick}
                >
                  {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                </button>
              </div>
              <button className="view-btn" onClick={() => onFullscreen(item)}>
                <FaExpand />
              </button>
              {item.featured && <div className="featured-badge"><FaStar /><span>Featured</span></div>}
            </div>
          </div>

          <div className="item-content">
            <h3 className="item-title">{item.title}</h3>
            <p className="item-description">{item.description}</p>
            <div className="item-meta">
              {item.location && <div className="meta-item"><FaMapMarkerAlt /> <span>{item.location}</span></div>}
              <div className="meta-item"><FaRegClock /> <span>{new Date(item.date).toLocaleDateString()}</span></div>
              <div className="meta-item"><FaEye /> <span>{item.views || 0} views</span></div>
            </div>
            
            <div className="item-footer">
              <button 
                className={`footer-btn ${isLiked ? 'liked' : ''} ${!isAuthenticated ? 'disabled' : ''}`} 
                onClick={handleLikeClick}
              >
                {isLiked ? <FaSolidHeart /> : <FaHeart />} <span>{item.likes || 0}</span>
              </button>
              <button 
                className={`footer-btn ${!isAuthenticated ? 'disabled' : ''}`} 
                onClick={handleCommentClick}
              >
                <FaRegCommentDots /> <span>{item.comments?.length || 0}</span>
              </button>
              <button className="footer-btn" onClick={() => onShare(item)}>
                <FaShareAlt />
              </button>
            </div>
            {!isAuthenticated && (
              <div className="login-overlay">
                <p>Login to interact</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* VIDEO ITEM */}
      {item?.type === "video" && (
        <div className="item-media">
          <img
            src={getVideoThumbnail(item)}
            alt={item?.title || "Video thumbnail"}
            className="media-image"
            loading="lazy"
          />

          <div className="media-overlay" style={{ background: "rgba(0,0,0,0.3)" }}>
             <div className="quick-actions">
                <button 
                  className={`action-btn ${isLiked ? 'active' : ''} ${!isAuthenticated ? 'disabled' : ''}`} 
                  onClick={handleLikeClick}
                >
                  <FaHeart /> <span>{item.likes || 0}</span>
                </button>
                <button 
                  className={`action-btn ${!isAuthenticated ? 'disabled' : ''}`} 
                  onClick={handleCommentClick}
                >
                  <FaRegCommentDots />
                </button>
              </div>
          </div>

          <div className="video-indicator" onClick={() => onFullscreen(item)}>
            <FaPlay />
          </div>
          
          {!isAuthenticated && (
            <div className="login-overlay">
              <p>Login to interact</p>
            </div>
          )}
        </div>
      )}

      {/* QUOTE ITEM */}
      {item.type === "quote" && (
        <div className="quote-content-wrapper">
          <FaQuoteLeft className="quote-icon" />
          <blockquote>"{item.content}"</blockquote>
          <cite>— {item.author}</cite>
          <button className="share-quote" onClick={() => onShare(item)}><FaShareAlt /></button>
          {!isAuthenticated && (
            <div className="login-overlay">
              <p>Login to interact</p>
            </div>
          )}
        </div>
      )}

      {/* STATS ITEM */}
      {item.type === "stats" && (
        <div className="stats-content-wrapper">
          <h3>{item.title}</h3>
          <div className="stats-grid">
             {Object.entries(item.stats || {}).map(([key, val]) => (
               <div key={key} className="stat-item">
                 <div className="stat-value">{val}</div>
                 <div className="stat-label">{key.replace(/([A-Z])/g, ' $1')}</div>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
});

// --- MAIN COMPONENT ---

const DonationGallery = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [likedImages, setLikedImages] = useState(new Set());
  const [savedItems, setSavedItems] = useState(new Set());
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Modal States
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareItem, setShareItem] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState('');

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      setIsAuthenticated(!!token);
    };
    
    checkAuth();
    
    // Optional: Listen for storage changes (if token changes in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const [likingItems, setLikingItems] = useState(new Set());

  // Fetch Data
  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await getGalleryItems();

      if (response?.success) {
        const normalizedData = response.data.map(item => ({
          ...item,
          likes: Array.isArray(item.likes) ? item.likes.length : (item.likes || 0),
          comments: Array.isArray(item.comments) ? item.comments : [],
        }));
        
        setGalleryItems(normalizedData);
      } else if (Array.isArray(response)) {
         const normalizedData = response.map(item => ({
          ...item,
          likes: Array.isArray(item.likes) ? item.likes.length : (item.likes || 0),
          comments: Array.isArray(item.comments) ? item.comments : [],
        }));
        setGalleryItems(normalizedData);
      } else {
        throw new Error("Invalid API response");
      }

    } catch (error) {
      console.error("Failed to load gallery:", error);
      setGalleryItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Calculate total stats
  const totalStats = galleryItems.reduce((acc, item) => ({
    likes: acc.likes + (item.likes || 0),
    comments: acc.comments + (item.comments?.length || 0),
    views: acc.views + (item.views || 0)
  }), { likes: 0, comments: 0, views: 0 });

  // Mouse Parallax Effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handlers
  const handleAuthWarning = (action) => {
    setPendingAction(action);
    setShowAuthWarning(true);
  };

  const handleLike = async (id) => {
    if (!isAuthenticated) {
      handleAuthWarning('like');
      return;
    }

    try {
      const res = await likeGalleryItem(id);

      setGalleryItems(prev =>
        prev.map(item =>
          item._id === id
            ? { ...item, likes: res.likes }
            : item
        )
      );

      // Update liked images set
      const newLiked = new Set(likedImages);
      if (newLiked.has(id)) {
        newLiked.delete(id);
      } else {
        newLiked.add(id);
      }
      setLikedImages(newLiked);

    } catch (error) {
      console.error("Like failed", error);
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        handleAuthWarning('like');
      }
    }
  };

  const handleSave = useCallback((id) => {
    if (!isAuthenticated) {
      handleAuthWarning('save');
      return;
    }
    
    const newSaved = new Set(savedItems);
    if (newSaved.has(id)) newSaved.delete(id);
    else newSaved.add(id);
    setSavedItems(newSaved);
  }, [savedItems, isAuthenticated]);

  const handleShare = useCallback((item) => {
    setShareItem(item);
    setShowShareModal(true);
  }, []);

  const handleFullscreen = useCallback((item) => {
    setSelectedImage(item);
    setShowFullscreen(true);
  }, []);

  const handleComment = useCallback((item) => {
    if (!isAuthenticated) {
      handleAuthWarning('comment');
      return;
    }
    setSelectedImage(item);
    setShowComments(true);
  }, [isAuthenticated]);

  const handleCommentSubmit = async (id) => {
    if (!isAuthenticated) {
      handleAuthWarning('comment');
      return;
    }

    if (!commentText.trim()) return;

    const text = commentText;

    // optimistic update
    const newComment = {
      id: Date.now(),
      text,
      user: "You",
      time: "Just now"
    };

    setGalleryItems(prev =>
      prev.map(item =>
        item._id === id
          ? { ...item, comments: [...(item.comments || []), newComment] }
          : item
      )
    );

    setSelectedImage(prev =>
      prev && prev._id === id
        ? { ...prev, comments: [...(prev.comments || []), newComment] }
        : prev
    );

    setCommentText("");

    try {
      await commentOnItem(id, text);
    } catch (error) {
      console.error("Comment failed", error);
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        handleAuthWarning('comment');
      }
    }
  };

  const handleNav = (direction) => {
    const currentIndex = galleryItems.findIndex(item => (item._id || item.id) === (selectedImage._id || selectedImage.id));
    let newIndex;
    if (direction === 'prev') newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    else newIndex = (currentIndex + 1) % galleryItems.length;
    
    setSelectedImage(galleryItems[newIndex]);
  };

  // Filters
  const filters = [
    { id: "all", label: "All", icon: <FaImages /> },
    { id: "donation-drive", label: "Donation Drives", icon: <FaHeart /> },
    { id: "motivational", label: "Motivational", icon: <FaQuoteLeft /> },
    { id: "achievements", label: "Achievements", icon: <FaAward /> },
    { id: "volunteer", label: "Volunteers", icon: <FaUsers /> },
  ];

  const filteredItems = galleryItems.filter(
    (item) => activeFilter === "all" || item.category === activeFilter
  );

  return (
    <WrapperSection>
      <div className="donation-gallery bg-gradient-to-br from-white/70 to-pink-50 rounded-2xl md:-mt-[480px] -mt-[500px]">
        <div className="gallery-background light">
          <div className="bg-gradient-light" />
        </div>

        <div className="gallery-container">
          <div className="gallery-header">
            <div className="header-content">
              <span className="subtitle">Our Impact Gallery</span>
              <h2 className="title">
                <span className="gradient-text">Gallery</span> of Hope & Heroes
              </h2>
              <p className="description">Witness the moments that save lives.</p>
            </div>
          </div>

          {/* Add Gallery Stats Header */}
          {!loading && galleryItems.length > 0 && (
            <GalleryStatsHeader 
              totalLikes={totalStats.likes}
              totalComments={totalStats.comments}
              totalViews={totalStats.views}
              totalItems={galleryItems.length}
            />
          )}

          <div className="gallery-filters">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`filter-btn ${activeFilter === filter.id ? "active" : ""}`}
              >
                <span className="filter-icon">{filter.icon}</span>
                <span className="filter-label">{filter.label}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <GallerySkeleton />
          ) : (
            <div className="gallery-grid">
              {filteredItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem" }}>
                  <h3>No items found</h3>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item._id || item.id}
                    className={`grid-item ${item.type === 'stats' || item.type === 'quote' ? 'span-2' : ''}`}
                  >
                    <GalleryItem 
                      item={item}
                      isLiked={likedImages.has(item._id || item.id)}
                      isSaved={savedItems.has(item._id || item.id)}
                      isHovered={hoveredItem === (item._id || item.id)}
                      mousePosition={mousePosition}
                      onHover={setHoveredItem}
                      onLike={handleLike}
                      onSave={handleSave}
                      onFullscreen={handleFullscreen}
                      onShare={handleShare}
                      onComment={handleComment}
                      isAuthenticated={isAuthenticated}
                      showAuthWarning={handleAuthWarning}
                    />
                  </div>
                ))
              )}
            </div>
          )}

          <div className="gallery-cta light">
            <h3>Share Your Donation Story!</h3>
            <div className="cta-buttons">
              <button className="cta-btn primary"><FaInstagram /> Share on Instagram</button>
            </div>
          </div>
        </div>

        <FullscreenViewer 
          show={showFullscreen}
          item={selectedImage}
          onClose={() => setShowFullscreen(false)}
          onPrev={() => handleNav('prev')}
          onNext={() => handleNav('next')}
          isLiked={selectedImage && likedImages.has(selectedImage._id || selectedImage.id)}
          onLike={handleLike}
          isAuthenticated={isAuthenticated}
          showAuthWarning={handleAuthWarning}
        />

        <ShareModal 
          show={showShareModal} 
          item={shareItem} 
          onClose={() => setShowShareModal(false)} 
        />
        
        <CommentsModal 
          show={showComments}
          item={selectedImage}
          onClose={() => setShowComments(false)}
          onSubmit={handleCommentSubmit}
          commentText={commentText}
          setCommentText={setCommentText}
          isAuthenticated={isAuthenticated}
          showAuthWarning={handleAuthWarning}
        />

        <AuthWarningModal 
          show={showAuthWarning}
          onClose={() => setShowAuthWarning(false)}
          action={pendingAction}
        />
      </div>
    </WrapperSection>
  );
};

export default DonationGallery;